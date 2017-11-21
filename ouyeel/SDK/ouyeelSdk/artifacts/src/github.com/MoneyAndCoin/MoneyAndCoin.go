//============================================================================
//1. 只用了CreateCustomerAccount，B2CPayCoin，C2CPayCoin三个函数，其余注释掉了
//2. ouyeel的账户直接初始化了，如果要改ouyeel的金额必须修改chaincode
//3. 欧冶的用户名直接在chaincode中固定为"ouyeel"
//============================================================================

package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("moneyToticket")

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

//=====================================================================================
//资金账户结构体
//=====================================================================================
type Account struct {
	Username string `json:"username"` // the owner of assets
	Role     string `json:"role"`
	Balance  float64    `json:"balance"`
}

//============================================================================================
//充值（兑换）记录结构体
//============================================================================================
type Exchange struct {
	UserId      string `json:"userId"`      //兑换申请者
	Amount      string `json:"amount"`      //兑换数量
	Type        string `json:"type"`        //兑换欧冶币/人民币
	Changedate  string `json:"changedate"`  //申请时间
	ChangeAgree string `json:"changeAgree"` //是否同意兑换
}

//============================================================================================
//转账记录结构体
//============================================================================================
type Transfer struct {
	UserId        string `json:"userId"`        //付款人
	Payee         string `json:"payee"`         //收款人
	Amount        string `json:"amount"`        //兑换欧冶币/人民币
	UserIdBalance string `json:"userIdBalance"` //付款人余额
	PayeeBalance  string `json:"payeeBalance"`  //收款人余额
}

//=====================================================================================
// 初始化ouyeel账户
// args: 用户名username，用户角色role，账户欧冶币余额balance
//=====================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### 初始化欧冶账户 ###########")
	_, args := stub.GetFunctionAndParameters()

	var err error
	var account Account

	// Initialize the asset of account
	account.Username = args[0]
	account.Role = args[1]
	account.Balance, err = strconv.ParseFloat(args[2],64)
	if err != nil {
		return shim.Error("Expecting integer value for asset holding")
	}
	logger.Info("account.Balance = %d\n", account.Balance)

	Bytes, _ := json.Marshal(account)
	// Write the state to the ledger
	err = stub.PutState(account.Username, Bytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("欧冶账户成功创建"))

}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### example_cc0 Invoke ###########")

	function, args := stub.GetFunctionAndParameters()

	/*if function == "C2BPayMoney" {
		return t.C2BPayMoney(stub, args)
	}*/
	if function == "B2CPayCoin" {
		return t.B2CPayCoin(stub, args)
	}
	/*if function == "QueryCoin" {
		return t.QueryCoin(stub, args)
	}*/
	if function == "C2CPayCoin" {
		return t.C2CPayCoin(stub, args)
	}
	if function == "CreateCustomerAccount" {
		return t.CreateCustomerAccount(stub, args)
	}
	/*if function == "C2BPayCoin" {
		return t.C2BPayCoin(stub, args)
	}
	if function == "B2CPayMoney" {
		return t.B2CPayMoney(stub, args)
	}*/

	logger.Errorf("Unknown action, check the first argument, must be one of 'CreateCustomerAccount', 'C2BPayMoney', 'B2CPayCoin', 'C2CPayCoin' or 'QueryCoin'. But got: %v", args[0])
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'CreateCustomerAccount', 'C2BPayMoney', 'B2CPayCoin', 'C2CPayCoin' or 'QueryCoin'. But got: %v", args[0]))
}

//===========================================================================
//创建用户资金账户
// args: 用户名username|用户角色role|账户欧冶币余额balance
//===========================================================================
func (t *SimpleChaincode) CreateCustomerAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	var account Account

	// Initialize the asset of account
	account.Username = args[0]
	account.Role = args[1]
	account.Balance, err = strconv.ParseFloat(args[2],64)
	if err != nil {
		return shim.Error("Expecting integer value for asset holding")
	}
	logger.Info("account.Balance = %d\n", account.Balance)

	Bytes, _ := json.Marshal(account)
	// Write the state to the ledger
	err = stub.PutState(account.Username, Bytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(account.Username + "账户创建成功"))

}

//===========================================================================
//用户支付给ouyeel人民币
// args: 用户ID|ouyeel ID|RMB
//===========================================================================
/*func (t *SimpleChaincode) C2BPayMoney (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("C2BPayMoney")

	var err error
    var customer Account
	var ouyeel Account
    var RMB int

	if len(args) != 3 {
	    return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	customer.ID = args[0]
	ouyeel.ID = args[1]

	// Get the state from the ledger
	// TODO: will be nice to have a GetAllState call to ledger
	customerbytes, err := stub.GetState(customer.ID)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if customerbytes == nil {
		return shim.Error("Entity not found")
	}
	err = json.Unmarshal(customerbytes, &customer)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}

	ouyeelbytes, err := stub.GetState(ouyeel.ID)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if ouyeelbytes == nil {
		return shim.Error("Entity not found")
	}
    err = json.Unmarshal(ouyeelbytes, &ouyeel)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}

    // Perform the money_pay execution
	RMB, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("Invalid transaction amount, expecting a integer value")
	}
	ouyeel.RMB = ouyeel.RMB + RMB
	customer.RMB = customer.RMB - RMB
	fmt.Printf(" ouyeel.RMB= %d, customer.RMB = %d\n", ouyeel.RMB, customer.RMB)

	ouyeelBytes, _ := json.Marshal(ouyeel)
	// Write the state back to the ledger
	err = stub.PutState(ouyeel.ID, ouyeelBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	customerBytes, _ := json.Marshal(customer)
	err = stub.PutState(customer.ID, customerBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

    return shim.Success([]byte("支付成功"))

}
*/

//==========================================================================
// ouyeel支付给用户coin
// args: 兑换申请者userId，兑换数量amount，兑换欧冶币/人民币type，申请时间changedate, 是否同意兑换changeAgree
//==========================================================================
func (t *SimpleChaincode) B2CPayCoin(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("B2CPayCoin")

	var err error
	var customer Account
	var ouyeel Account
	var coin float64
	var exchange Exchange
	var message string
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	customer.Username = args[0]
	//充值（兑换）记录
	exchange.UserId = args[0]
	exchange.Amount = args[1]
	exchange.Type = args[2]
	exchange.Changedate = args[3]
	exchange.ChangeAgree = args[4]
	//获取账户资金信息
	customerbytes, err := stub.GetState(customer.Username)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if customerbytes == nil {
		return shim.Error("Entity not found")
	}
	err = json.Unmarshal(customerbytes, &customer)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	}

	ouyeelbytes, err := stub.GetState("admin")
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if ouyeelbytes == nil {
		return shim.Error("Entity not found")
	}
	err = json.Unmarshal(ouyeelbytes, &ouyeel)
	if err != nil {
		return shim.Error("Failed to get ouyeel account: " + err.Error())
	}

	// 执行兑换功能
	if(exchange.Type=="人民币兑换欧冶币") {
		message="欧冶币充值成功！"+"充值账户："+string(exchange.UserId)+"；审核人"+string(ouyeel.Username)+"；充值金额："+exchange.Amount+"；充值日期："+exchange.Changedate
		coin, err = strconv.ParseFloat(args[1], 64)
		ouyeel.Balance = ouyeel.Balance - coin
		customer.Balance = customer.Balance + coin
		} else{
		message="欧冶币兑换人民币成功！"+"兑换账户："+string(exchange.UserId)+"；审核人"+string(ouyeel.Username)+"；兑换金额："+exchange.Amount+"；兑换日期："+exchange.Changedate
		coin, err = strconv.ParseFloat(args[1], 64)
		ouyeel.Balance = ouyeel.Balance + coin
		customer.Balance = customer.Balance - coin
		}

	//fmt.Printf(" ouyeel.Balance= %d, customer.Balance = %d\n", ouyeel.Balance, customer.Balance)

	ouyeelBytes, _ := json.Marshal(ouyeel)


	exchangeBytes, _ := json.Marshal(exchange)
	err = stub.PutState("0"+exchange.Changedate, exchangeBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// Write the state back to the ledger
	err = stub.PutState(ouyeel.Username, ouyeelBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	customerBytes, _ := json.Marshal(customer)
	err = stub.PutState(customer.Username, customerBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte(message))

}

//===========================================================================
// 用户返还欧冶币
// args: 用户 ID|ouyeel ID|coin
//===========================================================================
/*func (t *SimpleChaincode) C2BPayCoin (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("C2BPayCoin")

	var err error
    var customer Account
	var ouyeel Account
    var coin int

	if len(args) != 3 {
	    return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	ouyeel.ID = args[0]
	customer.ID = args[1]


	customerbytes, err := stub.GetState(customer.ID)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if customerbytes == nil {
		return shim.Error("Entity not found")
	}
	err = json.Unmarshal(customerbytes, &customer)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}

	ouyeelbytes, err := stub.GetState(ouyeel.ID)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if ouyeelbytes == nil {
		return shim.Error("Entity not found")
	}
    err = json.Unmarshal(ouyeelbytes, &ouyeel)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}

    // Perform the coin_pay execution
	coin, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("Invalid transaction amount, expecting a integer value")
	}
	ouyeel.Coin = ouyeel.Coin + coin
	customer.Coin = customer.Coin - coin
	fmt.Printf(" ouyeel.Coin= %d, customer.Coin = %d\n", ouyeel.Coin, customer.Coin)

	ouyeelBytes, _ := json.Marshal(ouyeel)
	// Write the state back to the ledger
	err = stub.PutState(ouyeel.ID, ouyeelBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	customerBytes, _ := json.Marshal(customer)
	err = stub.PutState(customer.ID, customerBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

    return shim.Success([]byte("返还成功"))

}
*/

//===========================================================================
// ouyeel返还人民币
// args: ouyeel ID|customer ID|RMB
//===========================================================================
/*func (t *SimpleChaincode) B2CPayMoney (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("B2CPayMoney")

	var err error
    var customer Account
	var ouyeel Account
    var RMB int

	if len(args) != 3 {
	    return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	ouyeel.ID = args[0]
	customer.ID = args[1]


	customerbytes, err := stub.GetState(customer.ID)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if customerbytes == nil {
		return shim.Error("Entity not found")
	}
	err = json.Unmarshal(customerbytes, &customer)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}

	ouyeelbytes, err := stub.GetState(ouyeel.ID)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if ouyeelbytes == nil {
		return shim.Error("Entity not found")
	}
    err = json.Unmarshal(ouyeelbytes, &ouyeel)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}

    // Perform the money_pay execution
	RMB, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("Invalid transaction amount, expecting a integer value")
	}
	ouyeel.RMB = ouyeel.RMB - RMB
	customer.RMB = customer.RMB + RMB
	fmt.Printf(" ouyeel.RMB= %d, customer.RMB = %d\n", ouyeel.RMB, customer.RMB)

	ouyeelBytes, _ := json.Marshal(ouyeel)
	// Write the state back to the ledger
	err = stub.PutState(ouyeel.ID, ouyeelBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	customerBytes, _ := json.Marshal(customer)
	err = stub.PutState(customer.ID, customerBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

    return shim.Success([]byte("返还成功"))

}
*/

//=======================================================================================
//用户A，用户B使用欧冶币转账
// args: 付款人userId，收款人payee，数量amount,付款人余额userIdBalance，收款人余额peeBalance
//=======================================================================================
func (t *SimpleChaincode) C2CPayCoin(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("PayCoin")

	var err error
	var customer1 Account
	var customer2 Account
	var coin float64
	var payDate string
	var transfer Transfer

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	customer1.Username = args[0]
	customer2.Username = args[1]

	customer1bytes, err := stub.GetState(customer1.Username)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if customer1bytes == nil {
		return shim.Error("Entity not found")
	}
	err = json.Unmarshal(customer1bytes, &customer1)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	}

	customer2bytes, err := stub.GetState(customer2.Username)
	if err != nil {
		return shim.Error("Failed to get state")
	}
	if customer2bytes == nil {
		return shim.Error("Entity not found")
	}
	err = json.Unmarshal(customer2bytes, &customer2)
	if err != nil {
		return shim.Error("Failed to get account: " + err.Error())
	}

	// 执行转账
	coin, err = strconv.ParseFloat(args[2], 64)
	if err != nil {
		return shim.Error("Invalid transaction amount, expecting a integer value")
	}
	customer1.Balance = customer1.Balance - coin
	customer2.Balance = customer2.Balance + coin
	//fmt.Printf(" customer1.Balance= %d, customer2.Balance = %d\n", customer1.Balance, customer2.Balance)

	//转账记录
	transfer.UserId = args[0]
	transfer.Payee = args[1]
	transfer.Amount = args[2]
	transfer.UserIdBalance = args[3]
	transfer.PayeeBalance = args[4]
	payDate = args[5]

	transferBytes, _ := json.Marshal(transfer)
	err = stub.PutState("0"+payDate, transferBytes)
	if err != nil {
		return shim.Error(err.Error())
	} else {

		customer1Bytes, _ := json.Marshal(customer1)
		customer2Bytes, _ := json.Marshal(customer2)
		// Write the state back to the ledger
		err = stub.PutState(customer1.Username, customer1Bytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(customer2.Username, customer2Bytes)
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	var message ="转账成功！"+"付款人："+string(transfer.UserId)+"；收款人："+string(transfer.Payee)+"；转账金额："+transfer.Amount+"；支付日期："+payDate
	return shim.Success([]byte(message))

}

//==========================================================================
// 查询账户余额
// args: 用户ID
//==========================================================================
/*func (t *SimpleChaincode) QueryCoin (stub shim.ChaincodeStubInterface, args []string) pb.Response {
        fmt.Println("QueryCoin")

	if len(args) != 1 {
	    return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	var account Account
	account.ID = args[0]
        Bytes, err := stub.GetState(account.ID)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	if Bytes == nil {
		return shim.Error("This ticket detail does not exists: " + account.ID)
        }


	err = json.Unmarshal(Bytes, &account)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}

	return(Bytes)
}
*/

//=======================================================================================
//function main
//=======================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
