FROM ubuntu

EXPOSE 7681

RUN apt update

RUN apt upgrade -y

RUN apt install curl wget vim git openssh-client htop tmux -y

WORKDIR /usr/bin

RUN wget https://github.com/tsl0922/ttyd/releases/download/1.6.1/ttyd_linux.x86_64

RUN mv ./ttyd_linux.x86_64 ./ttyd

RUN chmod +x ./ttyd

WORKDIR /

CMD ["ttyd", "bash"]