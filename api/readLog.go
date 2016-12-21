package api

import (
	"net/http"
	"io/ioutil"
	"os/exec"
	"fmt"
	"strconv"
	"encoding/json"
	"io"
	"os"
)

func ReadLog(w http.ResponseWriter, r *http.Request){

	r.ParseForm();
	lens := r.Form.Get("len")
	length,_ := strconv.Atoi(lens)
	if length == 0 {
		length = 100
	}

	name := r.Form.Get("name")
	if name == "" {
		ReturnResult(w,503,"name should not be null",nil)
		return
	}
	path := r.Form.Get("path")
	logPath := ""
	if path!= "" {
		logPath = path
	}else{
		logPath = "/mnt/log/abo/new/"+name+"/out.log"
	}

	key := r.Form.Get("key")
	command:=""
	if key == "" {
		command = fmt.Sprintf("tail -n %d %s",length,logPath)
	}else{
		command = fmt.Sprintf(`tail -n %d %s | grep "%s" `,length,logPath,key)
	}
	fmt.Println(command)

	_, err := os.Stat(logPath)
	if err != nil {
		ReturnResult(w,404,"file not exist!",nil)
		return
	}

	cmd := exec.Command("/bin/sh", "-c", command)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		ReturnResult(w,503,"StdoutPipe: " + err.Error(),nil)
		return
	}

	_, err = cmd.StderrPipe()
	if err != nil {
		ReturnResult(w,503,"StderrPipe: "+err.Error(),nil)
		return
	}

	if err := cmd.Start(); err != nil {
		ReturnResult(w,503,"Start: "+err.Error(),nil)
		return
	}

	bytes, err := ioutil.ReadAll(stdout)
	if err != nil {
		ReturnResult(w,503,"ReadAll stdout: "+err.Error(),nil)
		return
	}

	if err := cmd.Wait(); err != nil {
		ReturnResult(w,503,"Wait: no found "+err.Error(),nil)
		return
	}

	//w.Write(bytes)
	ReturnResult(w,200,"success",string(bytes))
}


func ReturnResult(w http.ResponseWriter, code int, msg string, data interface{}) {
	result := map[string]interface{}{
		"code": code,
		"msg":  msg,
		"data": data,
	}
	res, err := json.Marshal(result)
	if err != nil {
		io.WriteString(w, err.Error())
		return
	}
	w.Write(res)
}
