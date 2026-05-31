import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Game } from '../games/entities/game.entity';
import { GamePlayer } from '../games/entities/game-player.entity';
import { DashboardAnalyticsDto } from './dto/dashboard-analytics.dto';
import { AdminAnalyticsObservabilityService } from './admin-analytics-observability.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
    @InjectRepository(GamePlayer)
    private gamePlayerRepo: Repository<GamePlayer>,
    private readonly observability: AdminAnalyticsObservabilityService,
  ) {}

  async getDashboardAnalytics(): Promise<DashboardAnalyticsDto> {
    const startedAt = Date.now();

    try {
      const [totalUsers, activeUsers, totalGames, totalGamePlayers] =
        await Promise.all([
          this.countTotalUsers(),
          this.countActiveUsers(),
          this.countTotalGames(),
          this.countTotalGamePlayers(),
        ]);

      const result = {
        totalUsers,
        activeUsers,
        totalGames,
        totalGamePlayers,
      };

      this.observability.recordRequest(
        'dashboard',
        true,
        Date.now() - startedAt,
      );

      return result;
    } catch (error) {
      this.observability.recordRequest(
        'dashboard',
        false,
        Date.now() - startedAt,
      );
      throw error;
    }
  }

  async getTotalUsers(): Promise<number> {
    return this.trackRequest('users_total', () => this.countTotalUsers());
  }

  async getActiveUsers(): Promise<number> {
    return this.trackRequest('users_active', () => this.countActiveUsers());
  }

  async getTotalGames(): Promise<number> {
    return this.trackRequest('games_total', () => this.countTotalGames());
  }

  async getTotalGamePlayers(): Promise<number> {
    return this.trackRequest('games_players_total', () =>
      this.countTotalGamePlayers(),
    );
  }

  private async trackRequest<T>(
    endpoint: string,
    callback: () => Promise<T>,
  ): Promise<T> {
    const startedAt = Date.now();

    try {
      const result = await callback();
      this.observability.recordRequest(
        endpoint,
        true,
        Date.now() - startedAt,
      );
      return result;
    } catch (error) {
      this.observability.recordRequest(
        endpoint,
        false,
        Date.now() - startedAt,
      );
      throw error;
    }
  }

  private async countTotalUsers(): Promise<number> {
    return this.userRepo.count();
  }

  private async countActiveUsers(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.userRepo.count({
      where: {
        updated_at: MoreThan(thirtyDaysAgo),
      },
    });
  }

  private async countTotalGames(): Promise<number> {
    return this.gameRepo.count();
  }

  private async countTotalGamePlayers(): Promise<number> {
    return this.gamePlayerRepo.count();
  }
}
