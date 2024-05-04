-- CreateTable
CREATE TABLE `communties` (
    `id_communties` INTEGER NOT NULL AUTO_INCREMENT,
    `id_profile` INTEGER NOT NULL,
    `name_communties` VARCHAR(30) NOT NULL,
    `description_communties` TEXT NOT NULL,
    `image_communties` VARCHAR(50) NOT NULL,
    `verified_communties` BOOLEAN NOT NULL,
    `active_communties` BOOLEAN NOT NULL,
    `created_communties` DATETIME(0) NOT NULL,
    `updated_communties` DATETIME(0) NOT NULL,

    INDEX `id_profile`(`id_profile`),
    PRIMARY KEY (`id_communties`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `country` (
    `id_country` INTEGER NOT NULL AUTO_INCREMENT,
    `name_country` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id_country`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `followers` (
    `id_communties` INTEGER NOT NULL,
    `id_profile` INTEGER NOT NULL,
    `created_followers` DATETIME(0) NOT NULL,

    INDEX `id_communties`(`id_communties`),
    INDEX `id_profile`(`id_profile`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `id_profile` INTEGER NOT NULL AUTO_INCREMENT,
    `name_profile` VARCHAR(50) NOT NULL,
    `day_birth_profile` DATE NOT NULL,
    `gender_profile` VARCHAR(5) NOT NULL,
    `id_country` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `image_profile` VARCHAR(20) NOT NULL,
    `image_header_profile` VARCHAR(20) NOT NULL,
    `description_profile` VARCHAR(150) NOT NULL,
    `phone_profile` INTEGER NOT NULL,
    `updated_profile` DATETIME(0) NOT NULL,

    INDEX `id_country`(`id_country`),
    INDEX `id_user`(`id_user`),
    PRIMARY KEY (`id_profile`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `name_rol` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `id_rol` INTEGER NOT NULL,
    `name_user` VARCHAR(50) NOT NULL,
    `email_user` VARCHAR(30) NOT NULL,
    `password_user` TEXT NOT NULL,
    `active_user` BOOLEAN NOT NULL,
    `created_user` DATETIME(0) NOT NULL,

    INDEX `id_rol`(`id_rol`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `communties` ADD CONSTRAINT `communties_ibfk_1` FOREIGN KEY (`id_profile`) REFERENCES `profile`(`id_profile`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `followers` ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`id_communties`) REFERENCES `communties`(`id_communties`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `followers` ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`id_profile`) REFERENCES `profile`(`id_profile`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`id_country`) REFERENCES `country`(`id_country`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE;
