package come.sky.controller;

import com.sky.dto.userlogDTO;
import com.sky.entity.User;
import com.sky.vo.userlogVO;
import com.sky.result.Result;
import com.sky.ultis.JwtProperties;
import come.sky.service.Userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class usercontroller {

    @Autowired
    private Userservice userservice;

    @Autowired
    private JwtProperties jwtProperties;

    @GetMapping("/user")
    public User user(){
        User user = new User();
        user.setUsername("skyyyy");
        user.setSignature("1234");
        return user;
    }
    @PostMapping("/login")
    public Result<userlogVO> login(@RequestBody userlogDTO userlogdto){
        userservice.login(userlogdto);
        userlogVO userlogVO = new userlogVO();
        userlogVO.setStatus(200);
        return Result.success(userlogVO);
    }
}
