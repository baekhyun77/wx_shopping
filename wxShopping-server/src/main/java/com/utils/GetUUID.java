package com.utils;

import java.util.UUID;

public class GetUUID {
    public static String Uid() {
        String id = "";
        id = UUID.randomUUID().toString().replaceAll("-", "");
        return id;
    }
}
