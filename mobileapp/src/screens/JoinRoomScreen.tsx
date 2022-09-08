import React, { useContext, useState } from "react";
import gameService from "../services/GameService";
import socketService from "../services/SocketService";

interface IJoinRoomProps {}


export function JoinRoom(props: IJoinRoomProps) {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setJoining] = useState(false);

  const handleRoomNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const socket = socketService.socket;
    if (!roomName || roomName.trim() === "" || !socket) return;

    setJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((err) => {

      });


    setJoining(false);
  };

  return (
    <form onSubmit={joinRoom}>
    </form>
  );
}