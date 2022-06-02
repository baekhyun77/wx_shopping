package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.Announce;
import com.mapper.AnnounceMapper;
import com.service.IAnnounceService;
import org.springframework.stereotype.Service;

@Service
public class AnnounceServiceImpl extends ServiceImpl<AnnounceMapper, Announce> implements IAnnounceService{

}
