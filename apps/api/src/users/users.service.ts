import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import type { User } from "@mahalle/database";

export type SafeUser = Omit<User, "passwordHash">;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: { email: string; passwordHash: string; fullName: string; phone?: string }): Promise<User> {
    return this.prisma.user.create({
      data: { ...data, email: data.email.trim().toLowerCase() }
    });
  }

  /** Strips the password hash before a user is ever serialized in a response. */
  toSafeUser(user: User): SafeUser {
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }
}
