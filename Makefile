tag=latest

all: run

run:
	npm run dev

build:
	npm run build

docker: build
	docker build -t yiyuhki/branddreamfront:$(tag) .

push: docker
	docker push yiyuhki/branddreamfront:$(tag)

dummy:
