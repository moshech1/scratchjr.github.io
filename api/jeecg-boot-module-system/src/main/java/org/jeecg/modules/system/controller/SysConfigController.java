package org.jeecg.modules.system.controller;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.jeecg.common.api.vo.Result;
import org.jeecg.config.QiniuConfig;
import org.jeecg.modules.system.entity.SysConfig;
import org.jeecg.modules.system.service.ISysConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sys/config")
public class SysConfigController {
    @Autowired
    private ISysConfigService sysConfigService;
    @Value(value="${jeecg.path.staticDomain}")
    private String staticDomain;
    @Value(value="${jeecg.uploadType}")
    private String uploadType;

    @GetMapping("getConfig")
    public Result<String> getConfig(@RequestParam String key){
        Result<String> result = new Result<>();
        SysConfig sysConfig = sysConfigService.getOne(new QueryWrapper<SysConfig>().lambda().eq(SysConfig::getConfigKey, key));
        if (sysConfig == null){
            result.setSuccess(false);
        }else{
            result.setSuccess(true);
            result.setResult(sysConfig.getConfigValue());
        }
        return result;
    }

    //保存配置
    @PostMapping("saveTenantConfig")
    @RequiresRoles("admin")
    public Result<?> saveTenantConfig(@RequestBody JSONObject param){
        for (Map.Entry entry : param.entrySet()) {
            String key = (String)entry.getKey();
            sysConfigService.saveConfig( key , (String)entry.getValue());
        }
        return Result.ok("修改成功");
    }

    //获取所有的配置
    @GetMapping("getAllConfigList")
    public Result<List<SysConfig>> getAllConfigList(){
        Result<List<SysConfig>> result = new Result();
        List<SysConfig> list = sysConfigService.getConfigList();
        result.setResult(list);
        return result;
    }

    //获取所有的配置Map
    @GetMapping("getAllConfigMap")
    public Result<Map<String, Object>> getAllConfigMap(){
        Result<Map<String, Object>> result = new Result();
        Map<String, Object> list = sysConfigService.getConfigMap();
        result.setResult(list);
        return result;
    }

    //获取对外公开配置
    @GetMapping("getCurrentConfig")
    public Result<Map<String, Object>> getCurrentConfig(){
        Result<Map<String, Object>> result = new Result();
        Map<String, Object> tenantConfig = sysConfigService.getConfigMap();
        tenantConfig.put("uploadType", uploadType);
        tenantConfig.put("qiniuDomain", QiniuConfig.domain);
        tenantConfig.put("qiniuArea", QiniuConfig.area);
        tenantConfig.put("staticDomain", staticDomain);
        result.setResult(tenantConfig);
        return result;
    }
}
