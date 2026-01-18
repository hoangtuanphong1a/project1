import { Migration } from '@mikro-orm/migrations';

export class Migration20260117201407_addnotificationentity extends Migration {

  async up(): Promise<void> {
    this.addSql(`CREATE TABLE [notification] ([id] uniqueidentifier not null CONSTRAINT [notification_id_default] DEFAULT NEWID(), [user_id] nvarchar(255) not null, [title] nvarchar(255) not null, [message] text not null, [type] nvarchar(100) check ([type] in ('job_application', 'blog_comment', 'blog_like', 'system', 'general')) not null CONSTRAINT [notification_type_default] DEFAULT 'general', [is_read] bit not null CONSTRAINT [notification_is_read_default] DEFAULT 0, [metadata] nvarchar(max) null, [created_at] datetime2 not null, [updated_at] datetime2 not null, CONSTRAINT [notification_pkey] PRIMARY KEY ([id]));`);

    this.addSql(`alter table [notification] add constraint [notification_user_id_foreign] foreign key ([user_id]) references [Users] ([id]) on update cascade;`);
  }

  async down(): Promise<void> {
    this.addSql(`if object_id('[notification]', 'U') is not null DROP TABLE [notification];`);
  }

}
