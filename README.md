# Welcome to Elysia Prisma JWT Starter

Initial project using **ElysiaJs** and **Prisma** with **JWT** functionalities included. Just clone or fork this repo and start your project now.

> - Generate `accessToken` and `refreshToken`
> - `refreshToken` deleted when `logout` and re `login` from the same client

## Installation

- Install [bun](https://bun.sh/).
- Clone this repository.
- Run `bun i` to install the necessary packages.
- Set environment variables by copy or rename file `.env.example` to `.env` and adjust as needed
- Run `bunx prisma generate` or `bunx prisma db push` to initialize the database from the prisma [schema file](prisma/schema.prisma).
- Run `bun run dev` to start the application.

## Notes

Feel free to contribute and create Pull Request

or just

[!["Buy Me A Coffee"][buy-me-coffee-image]][buy-me-coffee-link]

| [![Ythyayat][author-image]][author-link] | [YthYayat][author-link] |
| ---------------------------------------- | ----------------------- |

Inspired by [elysia-jwt-example by msalihaltun][reference-link]

[buy-me-coffee-image]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
[buy-me-coffee-link]: https://www.buymeacoffee.com/ythyayat
[author-image]: https://avatars.githubusercontent.com/u/68425376?v=4&s=60
[author-link]: https://github.com/ythyayat
[reference-link]: https://github.com/msalihaltun/elysia-jwt-example
