# rails-next-zenn-clone

# ローカルでの起動方法
``` bash
$ docker compose up -d
$ docker compose exec rails /bin/bash
$ rails s -b '0.0.0.0'
```

# docker操作
``` bash
# docker compose run --rm <コンテナ名> <コンテナ内で実行するコマンド>

# rails new
$ docker compose run --rm rails rails new . --force --api --database=mysql --skip-action-cable --skip-sprockets --skip-turbolinks --skip-webpack-install --skip-test --skip-bundle

# bundle install
$ docker compose run --rm rails bundle install

# ビルド
$ docker compose build --no-cache

# コンテナ起動
$ docker compose up -d

# コンテナに入る
$ docker compose exec rails /bin/bash

# コンテナから出る
$ exit

# コンテナ停止
$ docker compose stop

# コンテナ削除
$ docker compose rm
```

# 参考
https://zenn.dev/ddpmntcpbr/books/rna-hands-on
