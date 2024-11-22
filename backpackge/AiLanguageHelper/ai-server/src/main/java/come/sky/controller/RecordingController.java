package come.sky.controller;// RecordingController.java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/recordings")
public class RecordingController {

    // 定义保存路径
    private final String UPLOAD_DIR = "recordings/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadRecording(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("录音文件为空", HttpStatus.BAD_REQUEST);
        }

        try {
            // 确保目录存在
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // 保存文件
            String filePath = UPLOAD_DIR + file.getOriginalFilename();
            Files.copy(file.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);

            return new ResponseEntity<>("录音上传成功，文件路径：" + filePath, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("录音上传失败", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
