import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserRepositoryResponse } from '../interfaces/user-repo-res.interface';
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(
    createUserData: CreateUserDTO,
  ): Promise<UserRepositoryResponse> {
    try {
      const user = await this.save(createUserData);

      if (!user) {
        return {
          success: false,
          message: "Can't create the User",
        };
      }

      return {
        success: true,
        message: 'Successful',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getUserById(id: number): Promise<UserRepositoryResponse> {
    try {
      const user = await this.findOne({ where: { id } });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'Successful',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getAllUsers(): Promise<UserRepositoryResponse> {
    try {
      const users = await this.find();

      return {
        success: true,
        message: 'Successful',
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getUserByEmail(email: string): Promise<UserRepositoryResponse> {
    try {
      const user = await this.findOne({ where: { email } });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        message: 'Successful',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async updateUser(
    id: number,
    updateData: Partial<CreateUserDTO>,
  ): Promise<UserRepositoryResponse> {
    try {
      const user = await this.findOne({ where: { id } });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      const updatedUser = await this.save({ ...user, ...updateData });

      return {
        success: true,
        message: 'Successful',
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
