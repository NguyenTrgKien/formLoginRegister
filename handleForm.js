// handle event click change form login resgister
const linkConvertLogin = document.querySelector(".form-register__changeLogin-login");
const formRegister = document.querySelector(".form-register");
const formLogin = document.querySelector(".form-login");
const linkConvertRegister = document.querySelector(".form-login__login-btn");
function handleEvenntForm() {
    if(linkConvertLogin){
        linkConvertLogin.onclick = function(e) {
            formRegister.style.display = "none";
            formLogin.style.display = "block";
        }   
        linkConvertRegister.onclick = function() {
            formLogin.style.display = "none";
            formRegister.style.display = "block";
        }
    }
    
}

handleEvenntForm();


function Validation(option) {
    const formElement = document.querySelector(option.form);
    var arrContainer = {};

    function Validate(inputElement,itemRule) {
        var elementMessage = getMessage(inputElement,option.formGroup).querySelector(option.message);
        var errorMessage;

        const rules = arrContainer[itemRule.elementName];
        for(var i = 0; i < rules.length; i++){
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                    var elementCheckbox = formElement.querySelector(itemRule.elementName + ":checked");
                    errorMessage = rules[i](elementCheckbox);
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) break; 
        }
        if(errorMessage){
            elementMessage.innerText = errorMessage;
        }else{
            elementMessage.innerText = "";
        }
        return !!errorMessage;
    }

    // lấy element message
    function getMessage(inputElement,elementParent) {
        while(inputElement.parentElement){
            if(inputElement.parentElement.matches(elementParent)){
                return inputElement.parentElement;
            }
            inputElement = inputElement.parentElement;
        }
    }
    
    if(formElement){

        formElement.onsubmit = (e) => {
            e.preventDefault();
            
            var isFormValid = true;
            option.rule.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.elementName);

                var isValid = Validate(inputElement,rule);
                if(isValid){
                    isFormValid = false;
                }
            })


            if(isFormValid){
                formLogin.style.display = "block";
                formRegister.style.display = "none";
                if(typeof option.onSubmit === "function"){
                    const inputs = formElement.querySelectorAll("input[name]");
                    var data = Array.from(inputs).reduce((value,input) => {
                        if(input.type === 'radio'){
                            if(input.checked){
                                value[input.name] = input.value;
                            }
                        }else if(input.type === 'checkbox'){
                            if(input.checked){
                                if(!Array.isArray(value[input.name])){
                                    value[input.name] = [];
                                }
                                value[input.name].push(input.value);
                            }
                        }else{
                            value[input.name] = input.value;
                        }
                        return value;
                    },{});

                    option.onSubmit(data);
                }
            }else{

            }
        }

        // duyệt qua từng trường hợp rule và lấy ra các thẻ input
        option.rule.forEach((itemRule) => {
            
            var inputElements = formElement.querySelectorAll(itemRule.elementName);
            Array.from(inputElements).forEach((inputElement) => {
                // đưa các rule vào array 
                if(Array.isArray(arrContainer[itemRule.elementName])){
                    arrContainer[itemRule.elementName].push(itemRule.test);
                }else{
                    arrContainer[itemRule.elementName] = [itemRule.test];
                }
                
                inputElement.onblur = (event) => {
                    
                    Validate(inputElement,itemRule);
                    
                }
    
                inputElement.oninput = (e) => {
                    var elementMessage = getMessage(inputElement,option.formGroup).querySelector(option.message);
                    elementMessage.innerText = "";
                }
            })

        })

    }

}

Validation.isRequired = function(selector, message,cb) {
    return {
        elementName : selector,
        test: function(value) {
            if(cb){
                return value === cb() ? undefined : message;
            }else{
                return value ? undefined : message || "Vui lòng nhập vào trường này!";
            }
        }
    }
}

Validation.isEmail = function(selector,message) {
    return {
        elementName : selector,
        test: function(value) {
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            return regex.test(value) ? undefined : message || "Vui lòng nhập vào trường này!";
        }
    }
}

Validation.isPassword = function(selector,valueLeght,message) {
    return {
        elementName : selector,
        test: function(value) {
            return value.length >= valueLeght ? undefined : message || "Vui lòng nhập vào trường này!";
        }
    }
}

Validation.isPasswordRepeat = function(selector,myfunction,message) {
    return {
        elementName : selector,
        test: function(value) {
            return value === myfunction() ? undefined : message || "Vui lòng nhập vào trường này!";
        }
    }
}

Validation.isPasswordLogin = function(selector,message,cb) {
    return {
        elementName: selector,
        test: function(value) {
            return value === cb() ? undefined : message;
        }
    }
}