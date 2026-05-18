const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu cập nhật mô tả gói cước cho sim (CommonJS)...');

  const updates = [
    { phone: "0914444444", description: "Hỗ trợ đăng ký gói cước Vinaphone 160B ưu đãi 5G 4GB/Ngày siêu khủng." },
    { phone: "0917333333", description: "Hỗ trợ đăng ký gói cước Vinaphone 160B ưu đãi 5G 4GB/Ngày siêu khủng." },
    { phone: "0915777777", description: "Tương thích gói cước 150 Vinaphone truy cập MXH không giới hạn 1.5GB/Ngày." },
    { phone: "0918555555", description: "Tương thích gói cước 150 Vinaphone truy cập MXH không giới hạn 1.5GB/Ngày." },
    { phone: "0916222222", description: "Tích hợp gói cước 330B Vinaphone siêu tốc độ cao 5G 12GB/Ngày." },
    { phone: "0919111111", description: "Tích hợp gói cước 330B Vinaphone siêu tốc độ cao 5G 12GB/Ngày." }
  ];

  for (const item of updates) {
    await prisma.sim.update({
      where: { phone: item.phone },
      data: { description: item.description }
    });
    console.log(`✅ Cập nhật SIM ${item.phone} với gói cước ${item.description.includes('160B') ? '160B' : item.description.includes('150') ? '150' : '330B'}`);
  }

  console.log('🎉 Cập nhật hoàn tất!');
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
