import { config } from '../config/config';
import { Role, User } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import RegistrationDTO from '../payloads/dto/register.dto';
import JsonModifier from '../utils/json_modifier.utils';
import { hashPassword } from '../utils/security.utils';
import { logger } from '../utils/logger.utils';

export class UserService {
  private static users: User[] = [];
  private static idCount: number = 0;
  private static jsonModifier = new JsonModifier();

  private static async loadUsers(): Promise<void> {
    try {
      logger.info("Loading users from file...");
      const storedUsers: User[] = await this.jsonModifier.readJsonToData(config.USERS_DATA);

      if (storedUsers && storedUsers.length > 0) {
        this.users = storedUsers;
        this.idCount = this.users[this.users.length - 1].id + 1;
        logger.info(`Loaded ${this.users.length} users. Next user ID: ${this.idCount}`);
      } else {
        this.users = [];
        this.idCount = 1;
        logger.warn("No users found. Starting with an empty user list.");
      }
    } catch (e) {
      logger.error(`Error loading users: ${e}`);
      throw new Error('Failed to load users');
    }
  }

  public static async getAllUser(): Promise<User[]> {
    await this.loadUsers();
    logger.info("Fetching all users.");
    return this.users;
  }

  public static async addUser(registrationDto: RegistrationDTO): Promise<boolean> {
    await this.loadUsers();
    try {
      logger.info(`Registering user: ${registrationDto.email}`);
      const hashedPassword = await hashPassword(registrationDto.password.trim());
      const newUser = new UserModel(
        this.idCount++,
        registrationDto.name,
        registrationDto.email,
        hashedPassword,
        registrationDto.role === 'manager' ? Role.Manager : Role.Employee
      );

      this.users.push(newUser);
      await this.jsonModifier.writeDataToJsonFile(this.users, config.USERS_DATA);
      await this.loadUsers();

      const isAdded = this.users.some((user) => user.name === registrationDto.name);
      if (isAdded) {
        logger.info(`User registered successfully: ${registrationDto.email}`);
      } else {
        logger.warn(`Failed to register user: ${registrationDto.email}`);
      }
      return isAdded;
    } catch (e) {
      logger.error(`Error registering user: ${e}`);
      return false;
    }
  }

  public static async getUserByEmail(email: string): Promise<User | null> {
    await this.loadUsers();
    logger.info(`Fetching user by email: ${email}`);
    const user = this.users.find((u: User) => u.email === email.trim()) || null;
    if (user) {
      logger.info(`User found: ${email}`);
    } else {
      logger.warn(`User not found: ${email}`);
    }
    return user;
  }

  public static async updateUser(email: string, updatedUserData: Partial<User>): Promise<boolean> {
    await this.loadUsers();

    try {
      logger.info(`Updating user: ${email}`);
      const userIndex = this.users.findIndex((u: User) => u.email === email.trim());

      if (userIndex === -1) {
        logger.warn(`User not found for update: ${email}`);
        return false;
      }

      this.users[userIndex] = { ...this.users[userIndex], ...updatedUserData };
      await this.jsonModifier.writeDataToJsonFile(this.users, config.USERS_DATA);
      logger.info(`User updated successfully: ${email}`);
      return true;
    } catch (e) {
      logger.error(`Error updating user: ${email}, error: ${e}`);
      return false;
    }
  }

  public static async deleteUser(email: string): Promise<boolean> {
    await this.loadUsers();

    try {
      logger.info(`Deleting user: ${email}`);
      const initialLength = this.users.length;
      this.users = this.users.filter((u: User) => u.email !== email.trim());

      if (this.users.length === initialLength) {
        logger.warn(`User not found for deletion: ${email}`);
        return false;
      }

      await this.jsonModifier.writeDataToJsonFile(this.users, config.USERS_DATA);
      logger.info(`User deleted successfully: ${email}`);
      return true;
    } catch (e) {
      logger.error(`Error deleting user: ${email}, error: ${e}`);
      return false;
    }
  }
}