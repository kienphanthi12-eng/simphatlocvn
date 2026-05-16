import { PrismaClient, SimType, SimStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu seed dữ liệu...');

  // 1. Admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@simphatlocvn.com' },
    update: {},
    create: {
      email: 'admin@simphatlocvn.com',
      password: hashedPassword,
      name: 'Administrator',
    },
  });
  console.log('✅ Đã tạo Admin user');

  // 2. Settings
  const settings = [
    { key: 'hotline', value: '0914 XXX XXX' },
    { key: 'zalo', value: '0914 XXX XXX' },
    { key: 'address', value: 'Số XX, Đường ABC, Quận/Huyện, Tỉnh/TP' },
    { key: 'open_hours', value: '8:00 - 21:00 mỗi ngày' },
    { key: 'bank_name', value: 'Vietcombank' },
    { key: 'bank_account', value: '1234567890' },
    { key: 'bank_holder', value: 'NGUYEN VAN A' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✅ Đã tạo Settings');

  // 3. 60 sim Vinaphone
  const simsToCreate = [
    // 8 Tam hoa
    { phone: "0914444444", prefix: "0914", type: SimType.TAM_HOA, price: 5000000, priceOriginal: 6000000, featured: true },
    { phone: "0915777777", prefix: "0915", type: SimType.TAM_HOA, price: 8000000, featured: false },
    { phone: "0916222222", prefix: "0916", type: SimType.TAM_HOA, price: 4500000, featured: false },
    { phone: "0917333333", prefix: "0917", type: SimType.TAM_HOA, price: 4800000, featured: true },
    { phone: "0918555555", prefix: "0918", type: SimType.TAM_HOA, price: 6000000, featured: false },
    { phone: "0919111111", prefix: "0919", type: SimType.TAM_HOA, price: 3500000, priceOriginal: 4000000, featured: false },
    { phone: "0911888888", prefix: "0911", type: SimType.TAM_HOA, price: 15000000, featured: true },
    { phone: "0912999999", prefix: "0912", type: SimType.TAM_HOA, price: 18000000, featured: false },

    // 8 Tứ quý
    { phone: "0916128888", prefix: "0916", type: SimType.TU_QUY, price: 20000000, featured: true },
    { phone: "0917999999", prefix: "0917", type: SimType.TU_QUY, price: 25000000, priceOriginal: 28000000, featured: true },
    { phone: "0913456666", prefix: "0913", type: SimType.TU_QUY, price: 12000000, featured: false },
    { phone: "0888123333", prefix: "0888", type: SimType.TU_QUY, price: 10000000, featured: false },
    { phone: "0886785555", prefix: "0886", type: SimType.TU_QUY, price: 11000000, featured: false },
    { phone: "0885237777", prefix: "0885", type: SimType.TU_QUY, price: 14000000, featured: true },
    { phone: "0884672222", prefix: "0884", type: SimType.TU_QUY, price: 9000000, featured: false },
    { phone: "0883891111", prefix: "0883", type: SimType.TU_QUY, price: 8500000, featured: false },

    // 5 Lục quý / Ngũ quý
    { phone: "0914555555", prefix: "0914", type: SimType.NGU_QUY, price: 30000000, featured: true },
    { phone: "0915666666", prefix: "0915", type: SimType.LUC_QUY, price: 50000000, priceOriginal: 55000000, featured: true },
    { phone: "0918777777", prefix: "0918", type: SimType.NGU_QUY, price: 25000000, featured: false },
    { phone: "0919888888", prefix: "0919", type: SimType.LUC_QUY, price: 80000000, featured: true },
    { phone: "0912222222", prefix: "0912", type: SimType.LUC_QUY, price: 60000000, featured: false },

    // 10 Tiến lên
    { phone: "0914123456", prefix: "0914", type: SimType.TIEN_LEN, price: 8000000, featured: true },
    { phone: "0888234567", prefix: "0888", type: SimType.TIEN_LEN, price: 9000000, priceOriginal: 10000000, featured: false },
    { phone: "0916345678", prefix: "0916", type: SimType.TIEN_LEN, price: 12000000, featured: true },
    { phone: "0917456789", prefix: "0917", type: SimType.TIEN_LEN, price: 15000000, featured: false },
    { phone: "0911567890", prefix: "0911", type: SimType.TIEN_LEN, price: 1000000, featured: false },
    { phone: "0913678901", prefix: "0913", type: SimType.TIEN_LEN, price: 800000, featured: false },
    { phone: "0886123456", prefix: "0886", type: SimType.TIEN_LEN, price: 7500000, featured: false },
    { phone: "0885234567", prefix: "0885", type: SimType.TIEN_LEN, price: 8500000, featured: false },
    { phone: "0884345678", prefix: "0884", type: SimType.TIEN_LEN, price: 9500000, featured: false },
    { phone: "0883456789", prefix: "0883", type: SimType.TIEN_LEN, price: 11000000, featured: false },

    // 8 Lộc phát
    { phone: "0914123868", prefix: "0914", type: SimType.LOC_PHAT, price: 2000000, featured: false },
    { phone: "0915456686", prefix: "0915", type: SimType.LOC_PHAT, price: 3000000, featured: false },
    { phone: "0916789668", prefix: "0916", type: SimType.LOC_PHAT, price: 4000000, featured: true },
    { phone: "0917112888", prefix: "0917", type: SimType.LOC_PHAT, price: 5000000, priceOriginal: 5500000, featured: false },
    { phone: "0918334688", prefix: "0918", type: SimType.LOC_PHAT, price: 3500000, featured: false },
    { phone: "0919556886", prefix: "0919", type: SimType.LOC_PHAT, price: 4500000, featured: false },
    { phone: "0911778668", prefix: "0911", type: SimType.LOC_PHAT, price: 5500000, featured: false },
    { phone: "0912999868", prefix: "0912", type: SimType.LOC_PHAT, price: 6500000, featured: false },

    // 5 Thần tài
    { phone: "0914123779", prefix: "0914", type: SimType.THAN_TAI, price: 2500000, featured: false },
    { phone: "0915456379", prefix: "0915", type: SimType.THAN_TAI, price: 1500000, featured: false },
    { phone: "0916789997", prefix: "0916", type: SimType.THAN_TAI, price: 3500000, featured: true },
    { phone: "0917112799", prefix: "0917", type: SimType.THAN_TAI, price: 4500000, featured: false },
    { phone: "0918334797", prefix: "0918", type: SimType.THAN_TAI, price: 2000000, priceOriginal: 2500000, featured: false },

    // 8 Năm sinh
    { phone: "0914121990", prefix: "0914", type: SimType.NAM_SINH, price: 1500000, featured: false },
    { phone: "0915341991", prefix: "0915", type: SimType.NAM_SINH, price: 1600000, featured: false },
    { phone: "0916561992", prefix: "0916", type: SimType.NAM_SINH, price: 1700000, featured: false },
    { phone: "0917781993", prefix: "0917", type: SimType.NAM_SINH, price: 1800000, featured: false },
    { phone: "0918901994", prefix: "0918", type: SimType.NAM_SINH, price: 1900000, featured: false },
    { phone: "0919121995", prefix: "0919", type: SimType.NAM_SINH, price: 2000000, featured: false },
    { phone: "0911341996", prefix: "0911", type: SimType.NAM_SINH, price: 2100000, featured: false },
    { phone: "0912562000", prefix: "0912", type: SimType.NAM_SINH, price: 3000000, priceOriginal: 3500000, featured: true },

    // 8 Dễ nhớ / Lặp kép
    { phone: "0914121212", prefix: "0914", type: SimType.LAP_KEP, price: 4000000, featured: false },
    { phone: "0915343434", prefix: "0915", type: SimType.LAP_KEP, price: 4500000, featured: false },
    { phone: "0916565656", prefix: "0916", type: SimType.LAP_KEP, price: 5000000, featured: false },
    { phone: "0917787878", prefix: "0917", type: SimType.LAP_KEP, price: 5500000, featured: true },
    { phone: "0918909090", prefix: "0918", type: SimType.LAP_KEP, price: 6000000, featured: false },
    { phone: "0919123123", prefix: "0919", type: SimType.DE_NHO, price: 3500000, featured: false },
    { phone: "0911456456", prefix: "0911", type: SimType.DE_NHO, price: 3800000, featured: false },
    { phone: "0912789789", prefix: "0912", type: SimType.DE_NHO, price: 4200000, featured: false },
  ];

  for (const sim of simsToCreate) {
    await prisma.sim.upsert({
      where: { phone: sim.phone },
      update: { ...sim, status: SimStatus.AVAILABLE },
      create: { ...sim, status: SimStatus.AVAILABLE },
    });
  }

  console.log(`✅ Đã tạo ${simsToCreate.length} sim Vinaphone mẫu`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
