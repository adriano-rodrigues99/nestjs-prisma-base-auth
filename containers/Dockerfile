FROM postgres:12.5-alpine

ADD postgresql.conf /etc/postgresql/postgresql.conf

RUN chown -R postgres:postgres /etc/postgresql

CMD ["-c","config_file=/etc/postgresql/postgresql.conf"]
