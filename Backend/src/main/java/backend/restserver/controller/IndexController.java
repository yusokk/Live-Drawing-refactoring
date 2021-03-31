package backend.restserver.controller;

import backend.restserver.config.auth.PrincipalDetails;
import backend.restserver.entity.User;
import backend.restserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController // View를 리턴
public class IndexController {
    private final Logger logger = LoggerFactory.getLogger(IndexController.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    //! 테스트 코드
    @GetMapping("/logincheck")
    public @ResponseBody
    Map<String, Object> logincheck(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        if (principalDetails != null) {
            System.out.println(principalDetails.getUser().getUsername());
//            return "redirect:http://localhost:3000";
            System.out.println("여기 맞아?" + principalDetails.getAttributes());
            return principalDetails.getAttributes();
        } else {
            return null;
        }
    }


    //! 테스트 코드
    @GetMapping("test/login")
    @ResponseBody
    public String testLogin(
            Authentication authentication, //! DI(의존성 주입)
            @AuthenticationPrincipal PrincipalDetails userDetails) { //! AuthenticationPrincipal 이 어노테이션을 통해 session정보에 접근할 수 있음.
        System.out.println("/test/login ==============");
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal(); //! 다운 캐스팅
        System.out.println("getUser : " + principalDetails.getUser());
        System.out.println("userDetails : " + userDetails.getUser());

        return "세션 정보 확인하기";
    }

    //! 테스트 코드
    @GetMapping("test/oauth/login")
    @ResponseBody
    public String testOAuthLogin(
            Authentication authentication, //! DI(의존성 주입)
            @AuthenticationPrincipal PrincipalDetails userDetails, //! AuthenticationPrincipal 이 어노테이션을 통해 session정보에 접근할 수 있음.
            @AuthenticationPrincipal OAuth2User oauth) {
        System.out.println("/test/oauth/login ==============");
//        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        //! oauth는 더이상 principalDetails로 다운 캐스팅할 수 없음 OAuth2User로 다운 캐스팅해야함
        //! class cast exception 했기떄문에 이제 터지지 않는다.
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        System.out.println("authentication : " + oauth2User.getAttributes());
        System.out.println("oauth2User : " + oauth.getAttributes());

        return "OAuth 세션 정보 확인하기";
    }



    //! OAuth 로그인을 해도 PrincipalDetails로 받을 수 있고
    //! 일반 로그인을 해도 PrincipalDetails로 받을 수 있다.
    //! 따라서 위 함수 처럼 testLogin, testOAuthLogin을 분기할 필요가 없다.

    //! 또 더 좋은건 위 테스트 로그인함수에서 authentication으로 접근하면
    //! PrincipalDetails로 다운캐스팅 해줘야 하는데
    //! @AuthenticationPrincipal 어노테이션으로 접근하면 바로 접근가능하다.
//    @GetMapping("/user")
//    public @ResponseBody String user(@AuthenticationPrincipal PrincipalDetails principalDetails) {
//        if(principalDetails != null) {
//            System.out.println("principalDetails : " + principalDetails.getUser());
//            System.out.println(principalDetails);
//        } else {
//            System.out.println("로그인 하세요");
//        }
//        return "user";
//    }

    @GetMapping("/user")
    public @ResponseBody String user() {
        return "user";
    }

    @GetMapping("/admin")
    public @ResponseBody String admin() {
        return "admin";
    }

    @GetMapping("/manager")
    public @ResponseBody String manager() {
        return "manager";
    }

    @PostMapping("/join")
    public String join(@RequestBody User user) {
        user.setRoles("ROLE_USER");
        System.out.println(user);
        String rawPassword = user.getPassword();
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);
        user.setPassword(encPassword);

        
        //! 여기서 아이디 중복체크 검사해야함
        
        userRepo.save(user);
//        return "redirect:http://localhost:3000/user/login-form";
//        return "redirect: https://jungleroad.shop/user/login-form";
        return "success";
    }

    //! 테스트 코드
    @Secured("ROLE_ADMIN")
    @GetMapping("/info")
    public @ResponseBody String info() {
        return "개인정보";
    }

    //! 테스트 코드
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')") //? <-- data 메소드를 실행하기전에 실행됨.
    @GetMapping("/data")
    public @ResponseBody String data() {
        return "데이터정보";
    }

}
