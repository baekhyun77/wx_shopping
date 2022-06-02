package com.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Map;


@RestController
public class UploadImage {

    @RequestMapping(value="/imgUpload",method=RequestMethod.POST)
    public ResponseEntity<?> imgFileUpload(@RequestParam("file")MultipartFile file,HttpServletRequest request) throws FileNotFoundException{
        //System.out.println(file + "asdfa");
        System.out.println(request);
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if(!path.exists()) path = new File("");
        System.out.println("path:"+path.getAbsolutePath());
        System.out.println(path + "fasdf");
        if(file!=null) {
            String fileName=System.currentTimeMillis()+(int)(Math.random()*1000)+file.getOriginalFilename();//生产随机名称
            System.out.println("打开文件... ");
            //File img = new File(path+"//static//images//"+fileName);
            File img = new File(path.getAbsolutePath() + "\\static\\images\\" + fileName);
            System.out.println(img.toString());
            File dir = new File(path.getAbsolutePath()+"\\static\\images");
            System.out.println(dir);
            try {
                if(!dir.exists()) {
                    dir.mkdir();
                }
                if(!img.exists()) {
                    img.createNewFile();
                }
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(img));
                bos.write(file.getBytes());
                bos.flush();
                bos.close();
                Map<String,Object> m =new HashMap<String,Object>();
                m.put("src", "images/"+fileName);
                return new ResponseEntity<>(m.values(), HttpStatus.OK);
            }catch(Exception e) {
                e.printStackTrace();
            }
        }else {
            return new ResponseEntity<String>("", HttpStatus.OK);
        }

        return new ResponseEntity<String>("", HttpStatus.OK);
    }
}

