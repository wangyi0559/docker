//============================================================================
//1.为了方便只使用CreateDigitalAssets，ChangeOwner，其余函数都注释掉了
//2.在ChangeOwner中把ownerid也改成了买家
//============================================================================

package main

import (
	"fmt"
	//"strconv"
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("DigitalAsset")

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("########### DigitalAsset Invoke ###########")

	function, args := stub.GetFunctionAndParameters()

	if function == "CreateDigitalAssets" {
		return t.CreateDigitalAssets(stub, args)
	}
	if function == "ChangeOwner" {
		return t.ChangeOwner(stub, args)
	}
	/*if function == "QueryDigitalAsset" {
		return t.QueryDigitalAsset(stub, args)
	}

	if function == "UpdateDigitalAsset" {
		return t.UpdateDigitalAsset(stub, args)
	}
	if function == "DeleteDigitalAsset" {
		return t.DeleteDigitalAsset(stub, args)
	}*/
	logger.Errorf("Unknown action, check the first argument, must be one of 'CreateDigitalAssets', 'ChangeOwner', 'UpdateDigitalAsset', 'DeleteDigitalAsset', or 'QueryDigitalAsset'. But got: %v", args[0])
	return shim.Error(fmt.Sprintf("Unknown action, check the first argument, must be one of 'CreateDigitalAssets', 'ChangeOwner', 'UpdateDigitalAsset', 'DeleteDigitalAsset', or 'QueryDigitalAsset'. But got: %v", args[0]))
}

//====================================================================================
//仓单数字资产结构体
//每一份数字资产对应一个仓单号 WarehouseReceiptID
//====================================================================================
type DigitalAsset struct {
	Bianhao    string `json:"bianhao"`
	OwnerId    string `json:"ownerId"`
	Money      string `json:"money"`
	Type       string `json:"type"`
	State      string `json:"state"`
	Buyer      string `json:"buyer"` //未售出时购买者为0
	Pinming    string `json:"pinming"`
	Guige      string `json:"guige"`
	Caizhi     string `json:"caizhi"`
	Chandi     string `json:"chandi"`
	Shuliang   string `json:"shuliang"`
	Zhongliang string `json:"zhongliang"`
	Jianshu    string `json:"jianshu"`
	Cangku     string `json:"cangku"`
}

//============================================================================================================
//根据仓单创建数字资产
// args: 数字资产编号bianhao，拥有者名称userId，金额money，类型type，状态state，购买者buyer（未售出时购买者为0），
//品名pinming，规格guige，材质caizhi，产地chandi，数量shuliang，重量zhongliang，件数jianshu，交割仓库cangku
//============================================================================================================
func (t *SimpleChaincode) CreateDigitalAssets(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("CreateDigitalAssets")

	var digitalAsset DigitalAsset //create a digital asset struct consisting of all properties
	digitalAsset.Bianhao = args[0]
	digitalAsset.OwnerId = args[1]
	digitalAsset.Money = args[2]
	digitalAsset.Type = args[3]
	digitalAsset.State = args[4]
	digitalAsset.Buyer = args[5]
	digitalAsset.Pinming = args[6]
	digitalAsset.Guige = args[7]
	digitalAsset.Caizhi = args[8]
	digitalAsset.Chandi = args[9]
	digitalAsset.Shuliang = args[10]
	digitalAsset.Zhongliang = args[11]
	digitalAsset.Jianshu = args[12]
	digitalAsset.Cangku = args[13]

	DigitalAssetBytes, _ := json.Marshal(digitalAsset)

	// ==== Check if digital asset already exists ====
	bytes, err := stub.GetState(digitalAsset.Bianhao)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	if bytes != nil {
		return shim.Error("This digital asset already exists: " + digitalAsset.Bianhao)
	}

	//create digital asset
	err = stub.PutState(digitalAsset.Bianhao, DigitalAssetBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("成功创建仓单数字资产"))

}

//======================================================================================================
//更改拥有者ID
// args: 仓单ID|新拥有者ID
//======================================================================================================
func (t *SimpleChaincode) ChangeOwner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("ChangeOwner")

	Bianhao := args[0]
	buyer := args[1]
	var err error

	DigitalAssetBytes, _ := stub.GetState(Bianhao)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	if DigitalAssetBytes == nil {
		return shim.Error("This digital asset does not exists: " + Bianhao)
	}
	var digitalAsset DigitalAsset

	err = json.Unmarshal(DigitalAssetBytes, &digitalAsset)
	if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	digitalAsset.Buyer = buyer
	//digitalAsset.OwnerId = buyer
	digitalAsset.State = "已售出"

	DigitalAssetBytes, _ = json.Marshal(digitalAsset)
	err = stub.PutState(Bianhao, DigitalAssetBytes)
	if err != nil {
		return shim.Error(err.Error())
	}
//	var message = "资产交易成功！"+"卖家："+string(digitalAsset.OwnerId)+"；购买人:"+string(digitalAsset.Buyer)+"；资产编号："+digital.Bianhao
	return shim.Success([]byte("资产交易成功！"))

}

/*
//==============================================================================
// 查询资产是否存在以及具体信息
// args: 仓单ID
//==============================================================================
func (t *SimpleChaincode) QueryDigitalAsset(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	WarehouseReceiptID := args[0]

	// Get the state from the ledger
	bytes, err := stub.GetState(WarehouseReceiptID)
	if err != nil {
		jsonResp := "{\"Error\":\"Failed to get state for " + WarehouseReceiptID + "\"}"
		return shim.Error(jsonResp)
	}

	if bytes == nil {
		jsonResp := "{\"Error\":\"Nil amount for " + WarehouseReceiptID + "\"}"
		return shim.Error(jsonResp)
	}


	return shim.Success(bytes)
}

//================================================================================================================
//更新资产信息
// args: 仓单ID|拥有者ID|类型|捆包ID|特性|数量|重量|总价
//================================================================================================================
func (t *SimpleChaincode) UpdateDigitalAsset (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("UpdateDigitalAsset")


	if len(args) != 8 {
	    return shim.Error("Incorrect number of arguments. Expecting 8")
	}

	WarehouseReceiptID := args[0]
	bytes, err := stub.GetState(WarehouseReceiptID)
    if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	if bytes == nil {
		return shim.Error("This digital asset does not exists: " + WarehouseReceiptID)
    }

	var digitalAsset DigitalAsset

	var NewdigitalAsset DigitalAsset
	                                                      //create a digital asset struct consisting of all properties
	 NewdigitalAsset.OwnerID = args[1]
	 NewdigitalAsset.Type = args[2]
	 NewdigitalAsset.BaleID = args[3]
	 NewdigitalAsset.Specification = args[4]
	 NewdigitalAsset.Quantity = args[5]
     NewdigitalAsset.Weight = args[6]
	 NewdigitalAsset.TotalPrice = args[7]

	//update the properties
	json.Unmarshal(bytes, &digitalAsset)
	digitalAsset = NewdigitalAsset
	bytes, err = json.Marshal(digitalAsset)
	if err != nil {
		return shim.Error( err.Error())
	}

	err = stub.PutState(WarehouseReceiptID, bytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte("更改成功"))

}

//=============================================================================================
//删除数字资产
// args: 仓单ID
//=============================================================================================
func (t *SimpleChaincode) DeleteDigitalAsset (stub shim.ChaincodeStubInterface, args []string) pb.Response {
    fmt.Println("DeleteDigitalAssets")


	if len(args) != 1 {
	    return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	WarehouseReceiptID := args[0]
    bytes, err := stub.GetState(WarehouseReceiptID)
    if err != nil {
		return shim.Error("Failed to get digital asset: " + err.Error())
	}
	var digitalAsset DigitalAsset
	json.Unmarshal(bytes, &digitalAsset)
	digitalAsset = DigitalAsset{}                        //delete the struct
	bytes, err = json.Marshal(digitalAsset)
	if err != nil {
		return shim.Error( err.Error())
	}
	err = stub.PutState(WarehouseReceiptID, bytes)

	err = stub.DelState(WarehouseReceiptID)
	if err != nil {
		return shim.Error("Failed to delete state:" + err.Error())
    }
    bytes, err = stub.GetState(WarehouseReceiptID)
    if err != nil {
		return shim.Error("digital asset has been deleted ")
	}

	return shim.Success([]byte("删除成功"))
}


*/
//=======================================================================================
//main function
//=================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}
