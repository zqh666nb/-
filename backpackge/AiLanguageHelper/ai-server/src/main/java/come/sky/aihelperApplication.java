package come.sky;

import com.sky.ultis.JwtProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
@EnableTransactionManagement //开启注解方式的事务管理
@Slf4j
public class aihelperApplication {
    public static void main(String[] args) {
        SpringApplication.run(aihelperApplication.class, args);
        log.info("server started");
    }
}
