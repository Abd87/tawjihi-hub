const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const courses = await prisma.course.findMany({select:{id:true, titleAr:true, locked:true, published:true, track:true}});
  console.log('Courses:', courses);
}
main().catch(console.error).finally(() => prisma.$disconnect());
