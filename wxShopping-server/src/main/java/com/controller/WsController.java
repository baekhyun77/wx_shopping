package com.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/ws/{fromUserId}/{toUserId}")
@Component
@Slf4j
public class WsController {
    /**
     * 存放所有在线的客户端
     */
    private static Map<String, Session> clients = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("fromUserId")String fromUserId, @PathParam("toUserId")String toUserId) {
        System.out.println(session.getPathParameters());
        //将用户id 添加到在线的客户端里面
        clients.put(fromUserId, session);

//        this.onMessage("111", fromUserId, toUserId);
    }
    /**
     * 客户端关闭
     * @param session session
     */
    @OnClose
    public void onClose(Session session, @PathParam("fromUserId")String fromUserId, @PathParam("toUserId")String toUserId) {
        log.info("有用户断开了, id为:{}", session.getId());
        clients.remove(fromUserId);
    }

    /**
     * 发生错误
     * @param throwable e
     */
    @OnError
    public void onError(Throwable throwable) {
        throwable.printStackTrace();
    }

    /**
     * 收到客户端发来消息
     * @param message  消息对象
     */
    @OnMessage
    public void onMessage(String message, @PathParam("fromUserId")String fromUserId, @PathParam("toUserId")String toUserId) {
        log.info("服务端收到客户端发来的消息: {}", message);
        this.sendAll(message, fromUserId, toUserId);
    }

    /**
     * 群发消息
     * @param message 消息内容
     */
    private void sendAll(String message, String fromUserId, String toUserId) {
        int online = 0;
        for (Map.Entry<String, Session> sessionEntry : clients.entrySet()) {
            //查询在线的用户，是否有一个map中的key与toUserId匹配，匹配则发送消息给他。
            if(sessionEntry.getKey().equals(toUserId)) {
                sessionEntry.getValue().getAsyncRemote().sendText(message);
                online = 1;
                break;
            }
        }

    }
}
