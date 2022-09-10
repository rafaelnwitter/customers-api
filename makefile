build:
	nest build

encryption:
	@sh scripts/encryption.sh

ssl:
	@mkcert $(site)

shell:
	REPL=true npm run start:dev
