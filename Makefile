run:
	docker compose start

stop:
	docker compose stop

status:
	docker compose ps

destroy:
	docker compose down --volumes --rmi local
	docker builder prune -f
install:
	docker compose up -d 
	docker builder prune -f

logs:
	docker compose logs -f
