import engines from '@prisma/engines';

engines.ensureBinariesExist().then(() => process.exit(0));

export {};
