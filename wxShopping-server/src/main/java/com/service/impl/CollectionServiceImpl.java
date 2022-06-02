package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.UserCollection;
import com.mapper.CollectionMapper;
import com.service.ICollectionService;
import org.springframework.stereotype.Service;

@Service
public class CollectionServiceImpl extends ServiceImpl<CollectionMapper, UserCollection> implements ICollectionService {
}
