import { randomUUID } from "node:crypto";
import { extname, join } from "node:path";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { SafeUser } from "../users/users.service";
import { OnboardingService } from "./onboarding.service";
import { UpdateOnboardingDraftDto } from "./dto/update-onboarding-draft.dto";
import type { OnboardingDraft } from "@mahalle/database";

interface OnboardingDraftResponse {
  draft: { status: string; currentStep: string; data: Record<string, unknown> };
}

function toDraftResponse(draft: OnboardingDraft): OnboardingDraftResponse {
  return {
    draft: {
      status: draft.status,
      currentStep: draft.currentStep,
      data: draft.data as Record<string, unknown>
    }
  };
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_ROOT = join(process.cwd(), "uploads", "onboarding");

@Controller("onboarding")
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  async get(@CurrentUser() user: SafeUser): Promise<OnboardingDraftResponse> {
    const draft = await this.onboardingService.getOrCreate(user.id);
    return toDraftResponse(draft);
  }

  @Patch()
  async update(@CurrentUser() user: SafeUser, @Body() dto: UpdateOnboardingDraftDto): Promise<OnboardingDraftResponse> {
    const draft = await this.onboardingService.update(user.id, dto);
    return toDraftResponse(draft);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clear(@CurrentUser() user: SafeUser) {
    await this.onboardingService.clear(user.id);
    return { success: true };
  }

  /** Uploads a Mahalle logo/cover image during onboarding, before a Tenant row exists to attach it to. */
  @Post("uploads/:kind")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req: Request, _file, cb) => cb(null, UPLOAD_ROOT),
        filename: (_req: Request, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`)
      }),
      limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
      fileFilter: (_req: Request, file, cb: (error: Error | null, acceptFile: boolean) => void) => {
        if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
          cb(new BadRequestException("Please upload a JPG, PNG, or WEBP image."), false);
          return;
        }
        cb(null, true);
      }
    })
  )
  uploadImage(
    @Param("kind") kind: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request
  ) {
    if (kind !== "logo" && kind !== "cover") {
      throw new BadRequestException("Unknown upload kind");
    }
    if (!file) {
      throw new BadRequestException("Please choose an image to upload.");
    }
    const origin = `${req.protocol}://${req.get("host")}`;
    return { url: `${origin}/uploads/onboarding/${file.filename}` };
  }
}
