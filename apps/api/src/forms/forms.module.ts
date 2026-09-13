import { Module } from "@nestjs/common";
import { PlatformModule } from "../platform/platform.module";
import { FormsController } from "./forms.controller";
import { FormsService } from "./forms.service";

@Module({
  imports: [PlatformModule],
  controllers: [FormsController],
  providers: [FormsService]
})
export class FormsModule {}
