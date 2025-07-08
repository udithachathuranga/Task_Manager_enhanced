-- CreateTable
CREATE TABLE "user" (
    "u_id" TEXT NOT NULL,
    "u_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "hash_pwd" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("u_id")
);

-- CreateTable
CREATE TABLE "project" (
    "p_id" TEXT NOT NULL,
    "p_name" TEXT NOT NULL,
    "p_title" TEXT NOT NULL,
    "p_description" TEXT NOT NULL,
    "p_status_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("p_id")
);

-- CreateTable
CREATE TABLE "task" (
    "t_id" TEXT NOT NULL,
    "t_description" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL,
    "task_status_id" TEXT NOT NULL,
    "p_id" TEXT NOT NULL,
    "added_by_id" TEXT NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("t_id")
);

-- CreateTable
CREATE TABLE "user_task" (
    "ud_id" TEXT NOT NULL,
    "assigned" TIMESTAMP(3) NOT NULL,
    "related_to_id" TEXT NOT NULL,
    "assigned_to_id" TEXT NOT NULL,

    CONSTRAINT "user_task_pkey" PRIMARY KEY ("ud_id")
);

-- CreateTable
CREATE TABLE "user_project" (
    "up_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "assigned_to_id" TEXT NOT NULL,

    CONSTRAINT "user_project_pkey" PRIMARY KEY ("up_id")
);

-- CreateTable
CREATE TABLE "role" (
    "r_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("r_id")
);

-- CreateTable
CREATE TABLE "task_status" (
    "t_status_id" TEXT NOT NULL,
    "t_status_name" TEXT NOT NULL,

    CONSTRAINT "task_status_pkey" PRIMARY KEY ("t_status_id")
);

-- CreateTable
CREATE TABLE "project_status" (
    "p_status_id" TEXT NOT NULL,
    "p_status_name" TEXT NOT NULL,

    CONSTRAINT "project_status_pkey" PRIMARY KEY ("p_status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("r_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_p_status_id_fkey" FOREIGN KEY ("p_status_id") REFERENCES "project_status"("p_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_task_status_id_fkey" FOREIGN KEY ("task_status_id") REFERENCES "task_status"("t_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_p_id_fkey" FOREIGN KEY ("p_id") REFERENCES "project"("p_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_task" ADD CONSTRAINT "user_task_related_to_id_fkey" FOREIGN KEY ("related_to_id") REFERENCES "task"("t_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_task" ADD CONSTRAINT "user_task_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project" ADD CONSTRAINT "user_project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("p_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_project" ADD CONSTRAINT "user_project_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "user"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;
