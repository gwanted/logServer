package api

import (
	"net/http"
	"io/ioutil"
	"os/exec"
	"fmt"
	"strconv"
	"encoding/json"
	"io"
)

func ReadLog(w http.ResponseWriter, r *http.Request){

	r.ParseForm();
	lens := r.Form.Get("len")
	length,_ := strconv.Atoi(lens)
	if length == 0 {
		length = 100
	}

	cmd := exec.Command("/bin/sh", "-c", fmt.Sprintf("tail -n %d /home/awesome/out.log",length))
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
		ReturnResult(w,503,"Wait: "+err.Error(),nil)
		return
	}

	w.Write(bytes)
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
