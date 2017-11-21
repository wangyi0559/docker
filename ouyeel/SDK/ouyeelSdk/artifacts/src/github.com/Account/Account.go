
package main


import (
	"fmt"
	//"strconv"
    "encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("Account")

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response  {
        return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### DigitalAsset Invoke ###########")

	function, args := stub.GetFunctionAndParameters()
	
	if function == "CreateAccount" {
		return t.CreateAccount(stub, args)
	}
        if function == "ChangePassword" {
		return t.ChangePassword(stub, args)
	}
	if function == "QueryAccount" {
		return t.QueryAccount(stub, args)
	}

	if function == "Verify" {
		return t.Verify(stub, args)
	}
	if function == "DeleteAccount" {
		return t.DeleteAccount(stub, args)
	}
	logger.Errorf("Unknown action, check the first argument, must be one of 'CreateAccount', 'ChangePassword', 'Verify', 'DeleteAccount', or 'QueryAccount'. But got: %v", args[0])
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'CreateAccount', 'ChangePassword', 'Verify', 'DeleteAccount', or 'QueryAccount'. But got: %v", args[0]))
}



//====================================================================================
//账号信息结构体
//====================================================================================
type Account struct {
	ID                 string `json:"id"`
	Password           string `json:"password"`
	Role               string `json:"role"`
}

//============================================================================================================
//创建账号
//包括欧冶账号和用户账号
//args: ID|密码|身份
//============================================================================================================
func (t *SimpleChaincode) CreateAccount (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("CreateAccount")

	
	if len(args) != 3 {
	    return shim.Error("Incorrect number of arguments. Expecting 3")
	}
    
	var account Account
	account.ID = args[0]
	account.Password = args[1]
	account.Role = args[2]
   
    Bytes, _ := json.Marshal(account)               
	
	// ==== Check if account already exists ====
	bytes, err := stub.GetState(account.ID)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	} 
	if bytes != nil {
		return shim.Error("This account already exists: " + account.ID)
    }
	
	//create digital asset
	err = stub.PutState(account.ID, Bytes)
	if err != nil {
		return shim.Error(err.Error())
        }
	
	return shim.Success([]byte("账号创建成功"))
	
}

//======================================================================================================
// 更改密码
// args: ID|原密码|新密码
//======================================================================================================
func (t *SimpleChaincode) ChangePassword(stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("ChangePassword")
	
	
	if len(args) != 3 {
	    return shim.Error("Incorrect number of arguments. Expecting 3")
	}
    
	//var account Account
	accountID := args[0]
	accountPassword := args[1]
	newPassword := args[2]
    var err error
	
	Bytes, _ := stub.GetState(accountID)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	} 
	if Bytes == nil {
		return shim.Error("This accountt does not exists: " + accountID)
    }
	var account Account
	
	err = json.Unmarshal(Bytes, &account)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	}
	if account.Password == accountPassword {
	    account.Password = newPassword
	}else {
	    return shim.Error("wrong password" )
	}
	
	bytes, _ := json.Marshal(account)
	err = stub.PutState(accountID, bytes)
    if err != nil {
		return shim.Error(err.Error())
    }
	
	return shim.Success([]byte("密码更改成功"))

}

//==============================================================================
// 查询账户是否存在
// args: ID
//==============================================================================
func (t *SimpleChaincode) QueryAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	accountID := args[0]

	// Get the state from the ledger
	bytes, err := stub.GetState(accountID)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + accountID + "\"}"
		return shim.Error(jsonResp)
	}
	if bytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + accountID + "\"}"
		return shim.Error(jsonResp)
	}
   
	
	return shim.Success(bytes)
}

//================================================================================================================
//验证账号密码是否匹配
//args: ID|密码
//================================================================================================================
func (t *SimpleChaincode) Verify (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("Verify")
	
	
	if len(args) != 2 {
	    return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	
	accountID := args[0]
	password := args[1]
	bytes, err := stub.GetState(accountID)
    if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	} 
	if bytes == nil {
		return shim.Error("This account does not exists: " + accountID)
    }

	var account Account
	err = json.Unmarshal(bytes, &account)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	}
	
	if account.Password == password {
		return shim.Success([]byte("correct password"))
	}else {
	    return shim.Error("wrong password ")
	}
	
	
}

//=============================================================================================
//删除账号
//args: ID
//=============================================================================================
func (t *SimpleChaincode) DeleteAccount (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("DeleteAccount")
	
	
	if len(args) != 1 {
	    return shim.Error("Incorrect number of arguments. Expecting 1")
	}
    
	accountID := args[0]
    bytes, err := stub.GetState(accountID)
    if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	}
	if bytes == nil {
		return shim.Error("this account is not found")
	}
	
	var account Account
	err = json.Unmarshal(bytes, &account)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	}
	
	account = Account{}                        //delete the struct
	bytes, err = json.Marshal(account)
	if err != nil {
		return shim.Error( err.Error())
	}
	err = stub.PutState(accountID, bytes)       
	
	err = stub.DelState(accountID)
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
    }
    bytes, err = stub.GetState(accountID)
    if err != nil {
		return shim.Success([]byte("delete successfully"))
	} 
     
	return shim.Success([]byte("此账号已被成功删除"))
}



//=======================================================================================
//main function 
//=================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
