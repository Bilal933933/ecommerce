import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvSchema } from './env.schema';

export function validateEnv(config: Record<string, unknown>): EnvSchema {
  const validated = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    stopAtFirstError: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((err) => {
        const field = err.property;
        const constraints = Object.values(err.constraints ?? {});
        return `${field}: ${constraints.join(', ')}`;
      })
      .join('\n');

    // خطأ في بدء التشغيل — لا يمر عبر GlobalExceptionFilter
    // لأن التطبيق لم يبدأ بعد
    throw new Error(`[ENV] متغيرات البيئة غير صالحة:\n${messages}`);
  }

  return validated;
}
