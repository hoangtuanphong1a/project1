import { Migration } from '@mikro-orm/migrations';

export class Migration20260116113832_newjob extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table [Companies] alter column [description] nvarchar(max);`);

    this.addSql(`alter table [Companies] alter column [name] nvarchar(255) not null;`);
    this.addSql(`alter table [Companies] alter column [description] nvarchar(255);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table [Companies] alter column [name] nvarchar(max);`);

    this.addSql(`alter table [Companies] alter column [name] nvarchar(300) not null;`);
    this.addSql(`alter table [Companies] alter column [description] text;`);
  }

}
