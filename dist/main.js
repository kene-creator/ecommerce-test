"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv_1 = require("dotenv");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
(0, dotenv_1.config)();
async function bootstrap() {
    var _a;
    const logger = new common_1.Logger('ecommerce-log');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ecommerce API')
        .setDescription('The Ecommerce API description')
        .setVersion('1.0')
        .addBasicAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('core/api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
    }));
    app.use((0, helmet_1.default)());
    const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
    await app.listen(port);
    logger.log(`App is listening on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map