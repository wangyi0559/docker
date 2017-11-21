package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("TransactionRecord")

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

//=====================================================================================
//交易信息结构体
//=====================================================================================
type Transaction struct {
	ID       string `json:"id"` // 数字资产ID
	Seller   string `json:"seller"`
	Buyer    string `json:"buyer"`
	Turnover string `json:"turnover"`
	Time     string `json:"time"` //交易时间
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### Invoke ###########")

	function, args := stub.GetFunctionAndParameters()

	if function == "TransactionRecord" {
		return t.TransactionRecord(stub, args)
	}
	if function == "QueryTransaction" {
		return t.QueryTransaction(stub, args)
	}
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'TransactionRecord', or 'QueryTransaction'. But got: %v", args[0]))
}

//===========================================================================
//记录交易信息
// args: 交易ID | 数字资产ID | 卖家ID | 买家ID | 交易额 | 交易时间
//===========================================================================
func (t *SimpleChaincode) TransactionRecord(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("TransactionRecord")

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	TransactionID := args[0]
	var transaction Transaction
	transaction.ID = args[1]
	transaction.Seller = args[2]

	transaction.Buyer = args[3]
	transaction.Turnover = args[4]
	transaction.Time = args[5]

	bytes, _ := json.Marshal(transaction)

	// ==== Check if transaction already exists ====
	bytes, err := stub.GetState(TransactionID)
	if err != nil {
		return shim.Error("Failed to get transaction: " + err.Error())
	}
	if bytes != nil {
		return shim.Error("This transaction already exists: " + TransactionID)
	}

	//record transaction
	err = stub.PutState(TransactionID, bytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("成功记录交易"))

}

//==============================================================================
// 查询交易信息
// args: 交易ID
//==============================================================================
func (t *SimpleChaincode) QueryTransaction(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	TransactionID := args[0]

	// Get the state from the ledger
	bytes, err := stub.GetState(TransactionID)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + TransactionID + "\"}"
		return shim.Error(jsonResp)
	}

	if bytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + TransactionID + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(bytes)
}

//=======================================================================================
//function main
//=======================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
