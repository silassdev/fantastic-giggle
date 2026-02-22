import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import Order from '@/models/Order';
import User from '@/models/User';
import WebhookEvent from '@/models/WebhookEvent';
import Notification from '@/models/Notification';
import { POST as paystackWebhookPOST } from '@/app/api/payments/paystack/webhook/route';
import { sign } from 'crypto';

jest.mock('node-fetch', () => jest.fn());
const mockedFetch = fetch as unknown as jest.Mock;

let mongod: MongoMemoryServer;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await WebhookEvent.deleteMany({});
    await Notification.deleteMany({});
    mockedFetch.mockReset();
});

test('paystack webhook processes payment once and creates notification', async () => {
    // create user and order
    const user = await User.create({ email: 'test@x.com', password: 'x' });
    const order = await Order.create({
        userId: user._id,
        items: [{ productId: new mongoose.Types.ObjectId(), name: 'A', price: 1000, qty: 1 }],
        shipping: { phone: '080', address: 'addr', city: 'Lagos', state: 'LA', country: 'NG' },
        total: 1000,
        paymentMethod: 'paystack',
        paymentRef: 'TEST_REF_1',
        status: 'PENDING_PAYMENT',
    });

    // prepare payload
    const payload = {
        event: 'charge.success',
        data: { id: 5555, reference: 'TEST_REF_1' },
    };
    const bodyText = JSON.stringify(payload);

    // mock signature verification by computing HMAC with env secret
    process.env.PAYSTACK_SECRET_KEY = 'paystack_test_secret';
    const crypto = require('crypto');
    const signature = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(bodyText).digest('hex');

    // mock verify endpoint to return success
    mockedFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ status: true, data: { status: 'success', amount: 100000 } }),
    });

    // build Request with headers
    const req = new Request('http://localhost/api/payments/paystack/webhook', {
        method: 'POST',
        headers: { 'x-paystack-signature': signature, 'content-type': 'application/json' },
        body: bodyText,
    });

    const res1 = await (paystackWebhookPOST as any)(req);
    expect(res1.status).toBe(200);

    // order should be marked PAID and notification created
    const updated = await Order.findById(order._id);
    expect(updated?.status).toBe('PAID');

    const notes = await Notification.find({ orderId: order._id });
    expect(notes.length).toBe(1);

    // calling webhook again with same event should not create duplicate notification
    const res2 = await (paystackWebhookPOST as any)(req);
    expect(res2.status).toBe(200);

    const notesAfter = await Notification.find({ orderId: order._id });
    expect(notesAfter.length).toBe(1);
});
