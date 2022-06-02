package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.Integral;
import com.mapper.IntegralMapper;
import com.service.IIntegralService;
import org.springframework.stereotype.Service;

@Service
public class IntegralServiceImpl extends ServiceImpl<IntegralMapper, Integral> implements IIntegralService {
}
