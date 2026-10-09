import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export const SERVER_NAME = "idosell-mcp-server";
export const SERVER_VERSION = "8.12.0";

export type JsonObject = Record<string, any>;

export interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
    tags?: string[];
    deprecated?: boolean;
}

/**
 * Map of tool definitions by name (populated during generation/build)
 */
export const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["clients_balance_get", {
    name: "clients_balance_get",
    description: `Method that enables extracting customer balance information from existing customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientNumbers": { "type": "array", "items": { "type": "number" }, "description": "Customer Id" }, "textSearch": { "type": "string", "description": "Text search through customer data." }, "active": { "type": "string", "enum": ["yes", "no"] }, "hasTradeCredit": { "type": "string", "enum": ["nonzero", "positive", "negative", "zero"] }, "lastPurchaseDate": { "type": "object", "description": "Start and end date (YYYY-MM-DD).", "properties": { "from": { "type": "string", "description": "Start date (YYYY-MM-DD)." }, "to": { "type": "string", "description": "End date (YYYY-MM-DD)." } } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned.\nAvailable elements:\n- clientId\n- clientBalance\n- clientBalanceHistory", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Results page number. Numbering begins at 0. Default value: 0." }, "resultsLimit": { "type": "number", "description": "Maximum number of results on a single page. Default is 100." } } },
    method: "get",
    pathTemplate: "/clients/balance",
    executionParameters: [{ "name": "clientNumbers", "in": "query" }, { "name": "textSearch", "in": "query" }, { "name": "active", "in": "query" }, { "name": "hasTradeCredit", "in": "query" }, { "name": "lastPurchaseDate", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_balance_post", {
    name: "clients_balance_post",
    description: `Method that allows for customer account balance operations.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clientId": { "type": "number", "description": "Unique client's number." }, "operation": { "type": "string", "description": "Operation:\n\t\t\t\t- add,\n\t\t\t\t- remove." }, "balance": { "type": "number", "description": "Value to add or remove from balance.", "format": "float" }, "currency": { "type": "string", "description": "Currency of operation." }, "note": { "type": "string", "description": "Note." }, "prepaidId": { "type": "number", "description": "Order payment identifier." } } }, "settings": { "type": "object", "description": "Settings", "properties": { "clientSettingSendMail": { "type": "boolean", "description": "Inform the customer about the introduced changes via an e-mail." }, "clientSettingSendSms": { "type": "boolean", "description": "Inform the customer about the introduced changes via a text message." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/balance",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_clients_get", {
    name: "clients_clients_get",
    description: `Method that enables extracting customer account details.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientsIds": { "type": "array", "items": { "type": "number" }, "description": "Customer numbers." }, "clientCodesExternal": { "type": "array", "items": { "type": "string" }, "description": "External system codes list" }, "clientTextSearch": { "type": "string", "description": "Text search through customer data." }, "clientIsActive": { "type": "string", "description": "Active", "enum": ["yes", "no"] }, "clientHasTradeCredit": { "type": "string", "description": "Trade credit:\n            - positive or negative,\n            - only positive,\n            - only negative,\n            - only zero.", "enum": ["nonzero", "positive", "negative", "zero"] }, "clientLastPurchaseDate": { "type": "object", "description": "Date of last purchase.", "properties": { "clientLastPurchaseDateBegin": { "type": "string", "description": "Start date (YYYY-MM-DD)." }, "clientLastPurchaseDateEnd": { "type": "string", "description": "End date (YYYY-MM-DD)." } } }, "clientsLastModificationDate": { "type": "object", "description": "Last modification date.", "properties": { "clientsLastModificationDateBegin": { "type": "string", "description": "Start date. You can enter both the date in the format YYYY-MM-DD and the date with the time YYYY-MM-DD h:m:s." }, "clientsLastModificationDateEnd": { "type": "string", "description": "End date. You can enter both the date in the format YYYY-MM-DD and the date with the time YYYY-MM-DD h:m:s." } } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned.\nAvailable fields:\n- clientId\n- clientsLastModificationDate\n- clientLogin\n- clientEmail\n- clientType\n- showClientAsPartner\n- blockAutomaticallyAssigningGroupDiscount\n- clientFirstName\n- clientLastName\n- clientBirthDate\n- clientFirm\n- clientNip\n- clientStreet\n- clientZipCode\n- clientCity\n- clientCountryId\n- langId\n- currencyId\n- clientRegionId\n- clientIsWholesaler\n- clientVatPreferences\n- clientGroupDiscountNumber\n- clientGroupDiscountName\n- clientCodeExternal\n- clientPhone1\n- clientPhone2\n- clientProvinceId\n- newsletterEmailApprovalsData\n- shops\n- clientBalances\n- clientTradeCredit\n- clientLoyaltyPoints\n- operator\n- isUnregistered\n- affiliateLogin\n- affiliateId\n- clientRegistrationDate\n- clientActiveInShops", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "clientRegistrationDate": { "type": "object", "description": "Client Registration Date ", "properties": { "clientRegistrationDateBegin": { "type": "string", "format": "date", "description": "Client Registration Date From" }, "clientRegistrationDateEnd": { "type": "string", "format": "date", "description": "Client Registration Date To" } } }, "shopId": { "type": "string", "description": "The ID of the shop, that client is assigned to." } } },
    method: "get",
    pathTemplate: "/clients/clients",
    executionParameters: [{ "name": "clientsIds", "in": "query" }, { "name": "clientCodesExternal", "in": "query" }, { "name": "clientTextSearch", "in": "query" }, { "name": "clientIsActive", "in": "query" }, { "name": "clientHasTradeCredit", "in": "query" }, { "name": "clientLastPurchaseDate", "in": "query" }, { "name": "clientsLastModificationDate", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }, { "name": "clientRegistrationDate", "in": "query" }, { "name": "shopId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_clients_put", {
    name: "clients_clients_put",
    description: `Method enables modifying existing customer account data.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "clientLogin": { "type": "string", "description": "Customer's login." }, "clientEmail": { "type": "string", "description": "E-mail address." }, "clientFirstName": { "type": "string", "description": "Customer's first name." }, "clientLastName": { "type": "string", "description": "Customer's last name." }, "clientStreet": { "type": "string", "description": "Street and number." }, "clientZipCode": { "type": "string", "description": "Customer's postal code." }, "clientCity": { "type": "string", "description": "Customer's city." }, "clientCountryId": { "type": "string", "description": "Country ID in accordance with ISO-3166." }, "clientProvinceId": { "type": "string", "description": "Administrative region code." }, "clientPassword": { "type": "string", "description": "Customer password (min. 8 characters)." }, "clientBirthDate": { "type": "string", "description": "Date of birth." }, "clientPhone1": { "type": "string", "description": "Cell phone." }, "clientFirm": { "type": "string", "description": "Customer's company name." }, "clientNip": { "type": "string", "description": "Customer Tax no." }, "clientNipUeDeclaration": { "type": "string", "description": "Customer NIP UE declaration", "enum": ["yes", "no"] }, "isLocalGovernmentUnit": { "type": "string", "description": "Is local government unit code for Podmiot3 in KSeF", "enum": ["yes", "no"] }, "clientIsWholesaler": { "type": "boolean", "description": "Determines, whether client is a wholesaler." }, "clientType": { "type": "string", "description": "Customer type, possible values:\n            - person - if client sex is not determined,\n            - person_male - when client is a male,\n            - person_female - when a customer is a woman,\n            - firm - when client is company.", "enum": ["person", "person_male", "person_female", "firm"] }, "langId": { "type": "string", "description": "Language ID" }, "blockLoginToOtherShops": { "type": "boolean", "description": "Defines availability of log in to other pages than the ones given in the element: shops  ." }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } }, "currencyId": { "type": "string", "description": "Currency ID" }, "clientCodeExternal": { "type": "string", "description": "External system code." }, "deliveryDates": { "type": "array", "description": "List with delivery dates and times", "items": { "type": "object", "properties": { "deliveryDate": { "type": "string", "description": "Delivery date in format: Y-m-d" }, "deliveryHours": { "type": "array", "description": "Delivery time in format: H:i", "items": { "type": "string" } } } } }, "clientBalanceAmountExternal": { "type": "number", "description": "Customer account balance in external system.", "format": "float" }, "clientTradeCreditLimitExternal": { "type": "number", "description": "Debt limit.", "format": "float" }, "newsletterEmailApproval": { "type": "boolean", "description": "Permission to E-mail Newsletter." }, "newsletterSmsApproval": { "type": "boolean", "description": "Permission to SMS Newsletter." }, "clientGroupDiscountNumber": { "type": "number", "description": "Discount group ID." }, "requestReference": { "type": "string", "description": "Field used for identifying request-response pairs for the endpoint." }, "newsletterEmailApprovalsData": { "type": "array", "description": "List of shops where a customer agreed or didn't agree to receive email newsletter.", "items": { "type": "object", "properties": { "inNewsletterEmailApproval": { "type": "string", "description": "Permission to E-mail Newsletter.", "enum": ["y", "n"] }, "shopId": { "type": "number", "description": "Shop Id" } } } }, "newsletterSmsApprovalsData": { "type": "array", "description": "List of shops where a customer agreed or didn't agree to receive sms newsletter.", "items": { "type": "object", "properties": { "inNewsletterSmsApproval": { "type": "string", "description": "Permission to SMS Newsletter.", "enum": ["y", "n"] }, "shopId": { "type": "number", "description": "Shop Id" } } } }, "clientActive": { "type": "boolean", "description": "Is the customer active" }, "numberOfDaysToPay": { "type": "number", "description": "Number of days to pay for invoice" }, "affiliateLogin": { "type": "string", "description": "The parameter stores information about who acquired the customer" }, "affiliateId": { "type": "number", "description": "ID of a partner who acquired a given customer." }, "clientAffiliateProgram": { "type": "string", "description": "Customer participation in the loyalty program:\n            - no - customer does not participate in the loyalty program,\n            - yes_voucher - customer participates, payouts only in vouchers,\n            - yes_voucher_cash - customer participates, payouts in vouchers or cash,\n            - banned - customer is blocked in the loyalty program.", "enum": ["no", "yes_voucher", "yes_voucher_cash", "banned"] }, "clientNote": { "type": "string", "description": "Notes from customer." } } } } } }, "clientsSettings": { "type": "object", "description": "Settings.", "properties": { "clientSettingSendMail": { "type": "boolean", "description": "Inform the customer about the introduced changes via an e-mail." }, "clientSettingSendSms": { "type": "boolean", "description": "Inform the customer about the introduced changes via a text message." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/clients",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_clients_post", {
    name: "clients_clients_post",
    description: `Method that enables adding new customer accounts to the IdoSell Shop administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "login": { "type": "string", "description": "Customer's login." }, "code_extern": { "type": "string", "description": "External system code." }, "email": { "type": "string", "description": "Customer e-mail address." }, "firstname": { "type": "string", "description": "Customer's first name." }, "lastname": { "type": "string", "description": "Customer's last name." }, "street": { "type": "string", "description": "Address." }, "zipcode": { "type": "string", "description": "Customer's postal code." }, "city": { "type": "string", "description": "Customer's city." }, "country_code": { "type": "string", "description": "Customer country (ISO 3166-1 alfa-2 code)." }, "province_code": { "type": "string", "description": "Administrative region code." }, "password": { "type": "string", "description": "Customer password (min. 8 characters)." }, "birth_date": { "type": "string", "description": "Date of birth." }, "phone": { "type": "string", "description": "Customer phone number." }, "company": { "type": "string", "description": "" }, "vat_number": { "type": "string", "description": "Customer Tax no." }, "nip_ue_declaration": { "type": "string", "description": "Customer NIP UE declaration", "enum": ["yes", "no"] }, "local_government_unit": { "type": "string", "description": "Is local government unit code for Podmiot3 in KSeF", "enum": ["yes", "no"] }, "wholesaler": { "type": "boolean", "description": "Determines, whether client is a wholesaler." }, "client_type": { "type": "string", "description": "Customer type, possible values:\n\t\t\t\t- person - if client sex is not determined,\n\t\t\t\t- person_male - when client is a male,\n\t\t\t\t- person_female - when a customer is a woman,\n\t\t\t\t- firm - when client is company.", "enum": ["person", "person_male", "person_female", "firm"] }, "language": { "type": "string", "description": "Customer language ID." }, "shops": { "type": "array", "description": "Determines, in which store account should be active.", "items": { "type": "number" } }, "block_autosigning_to_shops": { "type": "boolean", "description": "Defines availability of log in to other pages than the ones given in the element: shops  ." }, "currency": { "type": "string", "description": "Customer default currency (ISO 4217 code)." }, "delivery_dates": { "type": "array", "description": "", "items": { "type": "string" } }, "external_balance_value": { "type": "number", "description": "Customer account balance in external system.", "format": "float" }, "external_trade_credit_limit_value": { "type": "number", "description": "Debt limit.", "format": "float" }, "email_newsletter": { "type": "boolean", "description": "Have customer agreed to a newsletter. List of allowed parameters: \"y\" - yes, \"n\" - no.\n\t\t\t\tThe value will be set in all shops in which the customer account is active." }, "sms_newsletter": { "type": "boolean", "description": "Have customer agreed to a newsletter. List of allowed parameters: \"y\" - yes, \"n\" - no.\n\t\t\t\tThe value will be set in all shops in which the customer account is active." }, "client_group": { "type": "number", "description": "Discount group ID." }, "request_reference": { "type": "string", "description": "Field used for identifying request-response pairs for the endpoint." }, "newsletter_email_approvals": { "type": "array", "description": "List of shops where a customer agreed or didn't agree to receive email newsletter.", "items": { "type": "object", "properties": { "approval": { "type": "string", "description": "Have customer agreed to a newsletter. List of allowed parameters: \"y\" - yes, \"n\" - no.", "enum": ["y", "n"] }, "shop_id": { "type": "number", "description": "Store ID." } } } }, "newsletter_sms_approvals": { "type": "array", "description": "List of shops where a customer agreed or didn't agree to receive sms newsletter.", "items": { "type": "object", "properties": { "approval": { "type": "string", "description": "Have customer agreed to a newsletter. List of allowed parameters: \"y\" - yes, \"n\" - no.", "enum": ["y", "n"] }, "shop_id": { "type": "number", "description": "Store ID." } } } }, "block_group_auto_assignment": { "type": "boolean", "description": "Block assigning of discount groups automatically based on order history" }, "affiliate_program": { "type": "string", "description": "Customer participation in the loyalty program:\n\t\t\t\t- no - customer does not participate in the loyalty program,\n\t\t\t\t- yes_voucher - customer participates, payouts only in vouchers,\n\t\t\t\t- yes_voucher_cash - customer participates, payouts in vouchers or cash,\n\t\t\t\t- banned - customer is blocked in the loyalty program.", "enum": ["no", "yes_voucher", "yes_voucher_cash", "banned"] } } } } } }, "settings": { "type": "object", "description": "Settings.", "properties": { "send_mail": { "type": "boolean", "description": "Inform the customer with an email about the newly created account." }, "send_sms": { "type": "boolean", "description": "Inform the customer with a text message about the newly created account." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/clients",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_crm_search_post", {
    name: "clients_crm_search_post",
    description: `The method allows to download information about customers from the CRM module assigned to stores to which the user has rights.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "clientLogin": { "type": "string", "description": "Customer's login." }, "clientIsWholesaler": { "type": "string", "description": "Determines, whether client is a wholesaler.", "enum": ["yes", "no"] }, "clientCountryId": { "type": "string", "description": "Country ID in accordance with ISO-3166." }, "langId": { "type": "string", "description": "Language ID" }, "clientCustomerServiceRepresentativeLogin": { "type": "string", "description": "Customer service representative." }, "clientDiscountGroupNumber": { "type": "number", "description": "Customer group number" }, "clientRegistrationDate": { "type": "object", "description": "Date range of customer registrations", "properties": { "clientRegistrationDateBegin": { "type": "string", "description": "Start date (YYYY-MM-DD)." }, "clientRegistrationDateEnd": { "type": "string", "description": "End date (YYYY-MM-DD)." } } }, "clientLastLoginDate": { "type": "object", "description": "Date of last customer login (YYYY-MM-DD)", "properties": { "clientLastLoginDateBegin": { "type": "string", "description": "Start date (YYYY-MM-DD)." }, "clientLastLoginDateEnd": { "type": "string", "description": "End date (YYYY-MM-DD)." } } }, "clientType": { "type": "string", "description": "Customer type, possible values:\n            - person - if client sex is not determined,\n            - person_male - when client is a male,\n            - person_female - when a customer is a woman,\n            - firm - when client is company.", "enum": ["person", "person_male", "person_female", "firm"] }, "clientAffiliateProgram": { "type": "array", "description": "Information about the loyalty program\n            possible values:\n            - yes_voucher - when customers are in a loyalty program and have only used vouchers,\n            - yes_voucher_cash - when customers are in a loyalty program and have only used vouchers or cash deposits,\n            - yes_clients,\n            - yes_orders - when customers are in the loyalty program and have made at least one order,\n            - no - when customers are in the loyalty program,\n            - banned - when customers are blocked.", "items": { "type": "object", "properties": { "clientAffiliateProgramValue": { "type": "string", "description": "Does the customer participate in the loyalty program:\n            - yes_voucher_cash,\n            - yes_voucher,\n            - no,\n            - banned.", "enum": ["yes_voucher", "yes_voucher_cash", "yes_clients", "yes_orders", "no", "banned"] } } } }, "newsletterEmailApproval": { "type": "string", "description": "Permission to E-mail Newsletter." }, "newsletterSmsApproval": { "type": "string", "description": "Permission to SMS Newsletter." }, "searchByShops": { "type": "object", "description": "Shops", "properties": { "searchModeInShops": { "type": "string", "description": "How to match shops.\n        - one_of_selected - searches for customers assigned to at least one shop present in shopsList.\n        - exactly_selected - searches for customers assigned to all shops present in shopsList.", "enum": ["one_of_selected", "exactly_selected"] }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } } } }, "clientLoyaltyCard": { "type": "object", "description": "Loyalty cards:", "properties": { "clientHasLoyaltyCard": { "type": "string", "description": "Does the customer have a loyalty card.\n            - yes_active,\n            - yes_not_active,\n            - no.", "enum": ["yes_active", "yes_not_active", "no"] }, "clientLoyaltyCardId": { "type": "number", "description": "Customer loyalty card ID, omitted when has_loyalty_card = no." }, "clientLoyaltyCardNumber": { "type": "string", "description": "Customer loyalty card number, omitted when has_loyalty_card = no." } } }, "clientCodeExternal": { "type": "string", "description": "External system code." }, "clientCodesExternal": { "type": "array", "description": "External system codes list.", "items": { "type": "string" } }, "clientFirstName": { "type": "string", "description": "Customer's first name." }, "clientLastName": { "type": "string", "description": "Customer's last name." }, "clientNip": { "type": "string", "description": "Customer Tax no." }, "clientFirm": { "type": "string", "description": "Customer's company name." }, "clientEmail": { "type": "string", "description": "E-mail address." }, "newsletterEmailApprovalsData": { "type": "array", "description": "List of shops where a customer agreed or didn't agree to receive email newsletter.", "items": { "type": "object", "properties": { "inNewsletterEmailApproval": { "type": "string", "description": "Permission to E-mail Newsletter.", "enum": ["y", "n"] }, "shopId": { "type": "number", "description": "Shop Id" } } } }, "newsletterSmsApprovalsData": { "type": "array", "description": "List of shops where a customer agreed or didn't agree to receive sms newsletter.", "items": { "type": "object", "properties": { "inNewsletterSmsApproval": { "type": "string", "description": "Permission to SMS Newsletter.", "enum": ["y", "n"] }, "shopId": { "type": "number", "description": "Shop Id" } } } }, "clientLoyaltyCardNumber": { "type": "string", "description": "Customer loyalty card number, omitted when has_loyalty_card = no." }, "orders": { "type": "object", "description": "Orders.", "properties": { "clientHasOrders": { "type": "string", "description": "Has the customer made an order.\n            - yes,\n            - no.", "enum": ["yes", "no"] }, "ordersMinimalValue": { "type": "number", "description": "Minimum order value, omitted when hasOrders = no.", "format": "float" }, "ordersSerialNumberRange": { "type": "object", "description": "Data for serial number range.", "properties": { "ordersSerialNumberBegin": { "type": "string", "description": "Starting number of serial numbers range for sought products." }, "ordersSerialNumberEnd": { "type": "string", "description": "Ending number for serial number range." } } }, "ordersAddDate": { "type": "object", "description": "Date range of orders made by customers, omitted when hasOrders = no.", "properties": { "ordersAddDateBegin": { "type": "string", "description": "Start date (YYYY-MM-DD)." }, "ordersAddDateEnd": { "type": "string", "description": "End date (YYYY-MM-DD)." } } } } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "settingsExactSearch": { "type": "boolean", "description": "Determines, if data - that will be returned - will be exactly as entered values, or values should be fragment of customer data." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/crm/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_deliveryAddress_delete_post", {
    name: "clients_deliveryAddress_delete_post",
    description: `The method allows you to delete unused delivery addresses for customer accounts in the IdoSell Shop administration panel
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "clientLogin": { "type": "string", "description": "Customer's login." }, "clientCodeExternal": { "type": "string", "description": "External system code." }, "clientDeliveryAddressId": { "type": "number", "description": "Delivery address ID." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/deliveryAddress/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_deliveryAddress_get", {
    name: "clients_deliveryAddress_get",
    description: `Method that enables extracting information about delivery addresses assigned to existing customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientCodesExternal": { "type": "array", "description": "External system codes list.", "items": { "type": "string" } }, "clientIds": { "type": "array", "description": "Customer ID.", "items": { "type": "number" } }, "clientLogins": { "type": "array", "description": "Customer's login.", "items": { "type": "string" } } } },
    method: "get",
    pathTemplate: "/clients/deliveryAddress",
    executionParameters: [{ "name": "clientCodesExternal", "in": "query" }, { "name": "clientIds", "in": "query" }, { "name": "clientLogins", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_deliveryAddress_put", {
    name: "clients_deliveryAddress_put",
    description: `Method that enables editing the delivery address details for existing customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "clientLogin": { "type": "string", "description": "Customer's login." }, "clientCodeExternal": { "type": "string", "description": "External system code." }, "clientDeliveryAddressId": { "type": "string", "description": "Delivery address ID." }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } }, "currencyId": { "type": "string", "description": "Currency ID" }, "clientDeliveryAddressFirstName": { "type": "string", "description": "Recipient's first name." }, "clientDeliveryAddressLastName": { "type": "string", "description": "Recipient's last name." }, "clientDeliveryAddressAdditional": { "type": "string", "description": "Additional information." }, "clientDeliveryAddressPhone1": { "type": "string", "description": "Cell phone." }, "clientDeliveryAddressCity": { "type": "string", "description": "Recipient's city." }, "clientDeliveryAddressStreet": { "type": "string", "description": "Recipient street and number." }, "clientDeliveryAddressRegionId": { "type": "string", "description": "Administrative region code." }, "clientDeliveryAddressProvinceId": { "type": "string", "description": "Administrative region code." }, "clientDeliveryAddressZipCode": { "type": "string", "description": "Recipient's postal code." }, "clientDeliveryAddressCountry": { "type": "string", "description": "Recipient's country." } } } } } }, "clientsSettings": { "type": "object", "description": "Settings.", "properties": { "clientSettingSendMail": { "type": "boolean", "description": "Inform the customer about the introduced changes via an e-mail." }, "clientSettingSendSms": { "type": "boolean", "description": "Inform the customer about the introduced changes via a text message." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/deliveryAddress",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_deliveryAddress_post", {
    name: "clients_deliveryAddress_post",
    description: `Method that enables adding delivery address details to existing customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "clientLogin": { "type": "string", "description": "Customer's login." }, "clientCodeExternal": { "type": "string", "description": "External system code." }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } }, "currencyId": { "type": "string", "description": "Currency ID" }, "clientDeliveryAddressFirstName": { "type": "string", "description": "Recipient's first name." }, "clientDeliveryAddressLastName": { "type": "string", "description": "Recipient's last name." }, "clientDeliveryAddressAdditional": { "type": "string", "description": "Additional information." }, "clientDeliveryAddressPhone1": { "type": "string", "description": "Cell phone." }, "clientDeliveryAddressCity": { "type": "string", "description": "Recipient's city." }, "clientDeliveryAddressStreet": { "type": "string", "description": "Recipient street and number." }, "clientDeliveryAddressRegionId": { "type": "string", "description": "Administrative region code." }, "clientDeliveryAddressProvinceId": { "type": "string", "description": "Administrative region code." }, "clientDeliveryAddressZipCode": { "type": "string", "description": "Recipient's postal code." }, "clientDeliveryAddressCountry": { "type": "string", "description": "Recipient's country." } } } } } }, "clientsSettings": { "type": "object", "description": "Settings.", "properties": { "clientSettingSendMail": { "type": "boolean", "description": "Inform the customer about the introduced changes via an e-mail." }, "clientSettingSendSms": { "type": "boolean", "description": "Inform the customer about the introduced changes via a text message." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/deliveryAddress",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_externalCode_put", {
    name: "clients_externalCode_put",
    description: `Method that enables setting external system codes for existing customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "client_id": { "type": "number", "description": "" }, "client_login": { "type": "string", "description": "Customer's login." }, "code_extern": { "type": "string", "description": "External system code." } } } } } }, "clientsSettings": { "type": "object", "description": "Settings.", "properties": { "clientSettingSendMail": { "type": "boolean", "description": "Inform the customer about the introduced changes via an e-mail." }, "clientSettingSendSms": { "type": "boolean", "description": "Inform the customer about the introduced changes via a text message." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/externalCode",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_giftcards_block_put", {
    name: "clients_giftcards_block_put",
    description: `Enables gift card blocking
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "giftCards": { "type": "array", "description": "List of gift cards", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Card ID" }, "number": { "type": "string", "description": "Card number" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/giftcards/block",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_giftcards_delete_post", {
    name: "clients_giftcards_delete_post",
    description: `Enables deleting a single or a list of gift cards
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "giftCards": { "type": "array", "description": "List of gift cards", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Card ID" }, "number": { "type": "string", "description": "Card number" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/giftcards/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_giftcards_put", {
    name: "clients_giftcards_put",
    description: `Enables editing gift parameters, e.g. changing its balance, validity date, number or PIN
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "giftCards": { "type": "array", "description": "List of cards to edit", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Card ID" }, "number": { "type": "string", "description": "Card number" }, "pin": { "type": "string", "description": "Card PIN" }, "name": { "type": "string", "description": "Name of card" }, "expirationDate": { "type": "string", "description": "Card expiration date" }, "balanceOperationType": { "type": "string", "description": "Balance operation type, possible values:\n                - set - balance positioning of funds,\n                - add - add funds to balance,\n                - subtract - subtract funds from balance.", "enum": ["set", "add", "subtract"] }, "balance": { "type": "object", "description": "Card balance", "properties": { "amount": { "type": "number", "description": "Available balance", "format": "float" }, "currency": { "type": "string", "description": "Currency ID" } } }, "shops": { "type": "array", "description": "List of shops the card is active in", "items": { "type": "number" } }, "note": { "type": "string", "description": "" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/giftcards",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_giftcards_post", {
    name: "clients_giftcards_post",
    description: `Enables adding new gift cards with the selected card type
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "giftCards": { "type": "array", "description": "List of cards to add", "items": { "type": "object", "properties": { "typeId": { "type": "number", "description": "Gift card type id" }, "number": { "type": "string", "description": "Card number" }, "pin": { "type": "string", "description": "Card PIN" }, "name": { "type": "string", "description": "Name of card" }, "expirationDate": { "type": "string", "description": "Card expiration date" }, "balance": { "type": "object", "description": "Card balance", "properties": { "amount": { "type": "number", "description": "Available balance", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } }, "shops": { "type": "array", "description": "List of shops the card is active in", "items": { "type": "number" } }, "note": { "type": "string", "description": "" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/giftcards",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_giftcards_search_post", {
    name: "clients_giftcards_search_post",
    description: `Enables searching for gift cards and retrieving information about indicated gift cards
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "giftCards": { "type": "array", "description": "List of gift cards", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Card ID" }, "number": { "type": "string", "description": "Card number" }, "pin": { "type": "string", "description": "Card PIN" } } } }, "searchGiftCards": { "type": "object", "description": "element is an element array of type searchGiftCards", "properties": { "giftCardTypeId": { "type": "number", "description": "Gift cards type ID" }, "name": { "type": "string", "description": "Name" }, "noteContain": { "type": "string", "description": "Notes contain" }, "balanceFrom": { "type": "number", "description": "Value from", "format": "float" }, "balanceTo": { "type": "number", "description": "Value to", "format": "float" }, "expirationDateFrom": { "type": "string", "description": "Expiration date from" }, "expirationDateTo": { "type": "string", "description": "Expiration date to" }, "issueDateFrom": { "type": "string", "description": "Created from" }, "issueDateTo": { "type": "string", "description": "Created to" }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/giftcards/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_giftcards_types_get", {
    name: "clients_giftcards_types_get",
    description: `Allows for downloading all types of gift cards defined in the administration panel
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/clients/giftcards/types",
    executionParameters: [{ "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_giftcards_unblock_put", {
    name: "clients_giftcards_unblock_put",
    description: `Enables gift card unblocking
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "giftCards": { "type": "array", "description": "List of gift cards", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Card ID" }, "number": { "type": "string", "description": "Card number" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/giftcards/unblock",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_membershipCards_get", {
    name: "clients_membershipCards_get",
    description: `Method that enables extracting information about loyalty cards available in the administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "number", "description": "Customer ID." }, "login": { "type": "string", "description": "Customer's login." } } },
    method: "get",
    pathTemplate: "/clients/membershipCards",
    executionParameters: [{ "name": "id", "in": "query" }, { "name": "login", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_membershipCards_put", {
    name: "clients_membershipCards_put",
    description: `Method that enables assigning loyalty cards to customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "id": { "type": "number", "description": "Customer ID." }, "login": { "type": "string", "description": "Customer's login." }, "membership_cards": { "type": "array", "description": "", "items": { "type": "object", "properties": { "ordinal_number": { "type": "number", "description": "Card ID entered by customer." }, "card_type": { "type": "number", "description": "Card ID." }, "number": { "type": "string", "description": "Loyalty card number." }, "pin": { "type": "number", "description": "Card PIN." }, "creation_date": { "type": "string", "description": "Issue date." }, "deactivate": { "type": "boolean", "description": "Determines whether a card should be deactivated." }, "set_rebate_group": { "type": "boolean", "description": "Flag that determines whether a discount group should be set." }, "errors": { "type": "object", "description": "Information on error that occurred during gate call.", "properties": { "faultCode": { "type": "number", "description": "Error code.\n                        List of error codes:\n                        0 - Operation was successful,\n                        1 - Login failure: invalid username or key,\n                        2 - Empty result,\n                        3 - No parameters were received,\n                        4 - Shop has been blocked due to number of overdue invoices owed to IAI Company" }, "faultString": { "type": "string", "description": "Error description." } } } } } } } }, "settings": { "type": "object", "description": "Settings", "properties": { "sendMail": { "type": "boolean", "description": "Inform the customer about the introduced changes via an e-mail." }, "sendSms": { "type": "boolean", "description": "Inform the customer about the introduced changes via a text message." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/membershipCards",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_newsletter_email_search_post", {
    name: "clients_newsletter_email_search_post",
    description: `Method that enables extracting a list of customer accounts that agreed / did not agree to receiving email newsletters.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "shops": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Store ID." }, "approval": { "type": "string", "description": "Have customer agreed to a newsletter. List of allowed parameters: \"y\" - yes, \"n\" - no.", "enum": ["y", "n"] }, "registered": { "type": "string", "description": "Is registered:\n                        y - only registered customers, \n                        n - only non-registered customers,\n                        null (argument not sent) - all.", "enum": ["y", "n"] } } } }, "language": { "type": "string", "description": "Customer language ID." }, "date": { "type": "object", "description": "", "properties": { "from": { "type": "string", "description": "Start date (YYYY-MM-DD HH:MM:SS)." }, "to": { "type": "string", "description": "End date (YYYY-MM-DD HH:MM:SS)." } } }, "return_elements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned", "items": { "type": "string" } }, "results_page": { "type": "number", "description": "Results page number. Numbering begins at 0. Default value: 0." }, "results_limit": { "type": "number", "description": "Maximum number of results on a single page. Default is 100." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/newsletter/email/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_newsletter_sms_search_post", {
    name: "clients_newsletter_sms_search_post",
    description: `Method that enables extracting a list of customer accounts that agreed / did not agree to receiving text message newsletters.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "shops": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Store ID." }, "approval": { "type": "string", "description": "Have customer agreed to a newsletter. List of allowed parameters: \"y\" - yes, \"n\" - no.", "enum": ["y", "n"] }, "registered": { "type": "string", "description": "Is registered:\n                        yes - only registered customers, \n                        no - only non-registered customers,\n                        null (argument not sent) - all.", "enum": ["y", "n"] } } } }, "language": { "type": "string", "description": "Customer language ID." }, "date": { "type": "object", "description": "", "properties": { "from": { "type": "string", "description": "Start date (YYYY-MM-DD HH:MM:SS)." }, "to": { "type": "string", "description": "End date (YYYY-MM-DD HH:MM:SS)." } } }, "return_elements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned", "items": { "type": "string" } }, "results_page": { "type": "number", "description": "Results page number. Numbering begins at 0. Default value: 0." }, "results_limit": { "type": "number", "description": "Maximum number of results on a single page. Default is 100." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/newsletter/sms/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_payerAddress_delete_post", {
    name: "clients_payerAddress_delete_post",
    description: `The method allows you to delete unused buyer addresses for customer accounts in the IdoSell Shop administration panel
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "payers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "clientId": { "type": "number", "description": "Unique client's number." }, "payerAddressId": { "type": "number", "description": "Buyer's address id." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/payerAddress/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_payerAddress_get", {
    name: "clients_payerAddress_get",
    description: `The method allows to retrieve buyer's addresses from sales documents, for existing customer accounts in the IdoSell administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientId": { "type": "string", "description": "Unique client's number." }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/clients/payerAddress",
    executionParameters: [{ "name": "clientId", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_payerAddress_put", {
    name: "clients_payerAddress_put",
    description: `The method allows to modify buyer's addresses in sales documents, for existing customer accounts in the IdoSell administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "payers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "clientId": { "type": "string", "description": "Unique client's number." }, "payerAddressId": { "type": "string", "description": "Buyer's address id." }, "payerAddressFirstName": { "type": "string", "description": "Buyer's first name." }, "payerAddressLastName": { "type": "string", "description": "Buyer's last name." }, "payerAddressFirm": { "type": "string", "description": "Company name." }, "payerAddressNip": { "type": "string", "description": "Customer VAT ID." }, "payerAddressStreet": { "type": "string", "description": "Buyer's street name and house number." }, "payerAddressZipCode": { "type": "string", "description": "Buyer's postal code." }, "payerAddressCity": { "type": "string", "description": "Buyer's city." }, "payerAddressCountryId": { "type": "string", "description": "Country code in the ISO 3166-1 A2 standard." }, "payerAddressPhone": { "type": "string", "description": "Buyer's telephone number." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/payerAddress",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_payerAddress_post", {
    name: "clients_payerAddress_post",
    description: `The method allows to add buyer's addresses to sales documents, for existing customer accounts in the IdoSell administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "payers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "clientId": { "type": "number", "description": "Unique client's number." }, "payerAddressFirstName": { "type": "string", "description": "Buyer's first name." }, "payerAddressLastName": { "type": "string", "description": "Buyer's last name." }, "payerAddressFirm": { "type": "string", "description": "Company name." }, "payerAddressNip": { "type": "string", "description": "Customer VAT ID." }, "payerAddressStreet": { "type": "string", "description": "Buyer's street name and house number." }, "payerAddressZipCode": { "type": "string", "description": "Buyer's postal code." }, "payerAddressCity": { "type": "string", "description": "Buyer's city." }, "payerAddressCountryId": { "type": "string", "description": "Country code in the ISO 3166-1 A2 standard." }, "payerAddressPhone": { "type": "string", "description": "Buyer's telephone number." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/payerAddress",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_clients_get", {
    name: "clients_pricelists_clients_get",
    description: `The getClients method returns a list of customer IDs assigned to an individual price list
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "priceListId": { "type": "number", "description": "Individual price list ID." } } },
    method: "get",
    pathTemplate: "/clients/pricelists/clients",
    executionParameters: [{ "name": "priceListId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_clients_put", {
    name: "clients_pricelists_clients_put",
    description: `The setClients method allows you to assign customers to an individual price list
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "priceListId": { "type": "number", "description": "Individual price list ID." }, "clientsIds": { "type": "array", "description": "Customer numbers.", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/pricelists/clients",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_delete_post", {
    name: "clients_pricelists_delete_post",
    description: `The delete method enables to delete an individual pricelist. The pricelist must not be associated with any customer. In order to check the clients related to the given group, the getClients method shall be used.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "priceListId": { "type": "number", "description": "Individual price list ID." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/pricelists/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_get", {
    name: "clients_pricelists_get",
    description: `The get method allows you to download individual price lists available in the administration panel
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "priceListIds": { "type": "array", "description": "List of individual price lists.", "items": { "type": "number" } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned.\nAvailable elements:\n- priceListId\n- priceListName\n- onlyOrderProductsWithManuallySetPrices\n- onlySeeProductsWithManuallySetPrices", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/clients/pricelists",
    executionParameters: [{ "name": "priceListIds", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_put", {
    name: "clients_pricelists_put",
    description: `The update method allows you to change the individual price list.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "priceListId": { "type": "number", "description": "Individual price list ID." }, "priceListName": { "type": "string", "description": "Name of individual price list." }, "onlyOrderProductsWithManuallySetPrices": { "type": "string", "description": "Restrict visibility to products listed in price list (other products will remain hidden)\n            - yes\n            - no", "enum": ["yes", "no"] }, "onlySeeProductsWithManuallySetPrices": { "type": "string", "description": "Restrict products visibility to products listed in price list, remaining products will be seen as \"Call for price\"\n            - yes\n            - no", "enum": ["yes", "no"] } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/pricelists",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_post", {
    name: "clients_pricelists_post",
    description: `The insert method enables you to add a new individual price list to the administration panel
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "priceListName": { "type": "string", "description": "Name of individual price list." }, "onlyOrderProductsWithManuallySetPrices": { "type": "string", "description": "Restrict visibility to products listed in price list (other products will remain hidden)\n            - yes\n            - no", "enum": ["yes", "no"] }, "onlySeeProductsWithManuallySetPrices": { "type": "string", "description": "Restrict products visibility to products listed in price list, remaining products will be seen as \"Call for price\"\n            - yes\n            - no", "enum": ["yes", "no"] } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/pricelists",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_products_get", {
    name: "clients_pricelists_products_get",
    description: `The getProducts method enables the retrieval of products from an individual price list together with the price
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "priceListId": { "type": "number", "description": "Individual price list ID." }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results per page. Value from 1 to 500." } } },
    method: "get",
    pathTemplate: "/clients/pricelists/products",
    executionParameters: [{ "name": "priceListId", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_products_put", {
    name: "clients_pricelists_products_put",
    description: `The setProducts method allows you to add goods to an individual price list and specify their price
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "priceListId": { "type": "number", "description": "Individual price list ID." }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "price": { "type": "number", "description": "Price.", "format": "float" }, "currencyId": { "type": "string", "description": "Currency ID" } } } }, "producers": { "type": "array", "description": "List of manufacturers assigned to sought products.", "items": { "type": "object", "properties": { "producerId": { "type": "number", "description": "Brand ID" }, "price": { "type": "number", "description": "Price.", "format": "float" }, "currencyId": { "type": "string", "description": "Currency ID" } } } }, "series": { "type": "array", "description": "Series list.", "items": { "type": "object", "properties": { "seriesId": { "type": "number", "description": "ID of series, to which product belongs." }, "price": { "type": "number", "description": "Price.", "format": "float" }, "currencyId": { "type": "string", "description": "Currency ID" } } } }, "categories": { "type": "array", "description": "List of categories in which sought products are present.", "items": { "type": "object", "properties": { "categoryId": { "type": "number", "description": "Category id" }, "price": { "type": "number", "description": "Price.", "format": "float" }, "currencyId": { "type": "string", "description": "Currency ID" } } } }, "menuItems": { "type": "array", "description": "", "items": { "type": "object", "properties": { "menuItemId": { "type": "number", "description": "ID of the menu node to which the product is to be assigned" }, "price": { "type": "number", "description": "Price.", "format": "float" }, "currencyId": { "type": "string", "description": "Currency ID" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/pricelists/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_pricelists_rename_put", {
    name: "clients_pricelists_rename_put",
    description: `The rename method enables changing the name of an individual price list
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "priceListName": { "type": "string", "description": "Name of individual price list." }, "priceListId": { "type": "number", "description": "Individual price list ID." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/pricelists/rename",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_prices_activeCard_get", {
    name: "clients_prices_activeCard_get",
    description: `Method that enables getting information about active customer loyalty cards assigned to customer accounts in the administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/clients/prices/activeCard",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_prices_discountGroups_get", {
    name: "clients_prices_discountGroups_get",
    description: `Method that enables extracting information about discount groups configured in the administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientDiscountGroupsNumbers": { "type": "array", "description": "Customer groups.", "items": { "type": "number" } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned.\nAvailable elements:\n- clientDiscountGroupNumber\n- clientDiscountGroupIsCombined\n- clientDiscountGroupType\n- clientDiscountGroupValue\n- clientDiscountGroupName", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/clients/prices/discountGroups",
    executionParameters: [{ "name": "clientDiscountGroupsNumbers", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_prices_discounts_get", {
    name: "clients_prices_discounts_get",
    description: `Method that allows for extracting information about individual discounts assigned to customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientsIds": { "type": "array", "description": "Customer numbers.", "items": { "type": "number" } }, "clientTextSearch": { "type": "string", "description": "Text search through customer data." }, "clientIsActive": { "type": "string", "description": "Active", "enum": ["yes", "no"] }, "clientHasTradeCredit": { "type": "string", "description": "Trade credit:\n            - positive or negative,\n            - only positive,\n            - only negative,\n            - only zero.", "enum": ["nonzero", "positive", "negative", "zero"] }, "clientLastPurchaseDate": { "type": "object", "description": "Date of last purchase.", "properties": { "clientLastPurchaseDateBegin": { "type": "string", "description": "Start date (YYYY-MM-DD)." }, "clientLastPurchaseDateEnd": { "type": "string", "description": "End date (YYYY-MM-DD)." } } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned.\nAvailable elements:\n- clientId\n- clientDiscountIsCombined\n- clientDiscountType\n- clientDiscountValue", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/clients/prices/discounts",
    executionParameters: [{ "name": "clientsIds", "in": "query" }, { "name": "clientTextSearch", "in": "query" }, { "name": "clientIsActive", "in": "query" }, { "name": "clientHasTradeCredit", "in": "query" }, { "name": "clientLastPurchaseDate", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_prices_discounts_put", {
    name: "clients_prices_discounts_put",
    description: `Method that enables assigning individual discount to existing customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "customers": { "type": "object", "description": "", "properties": { "customers_numbers": { "type": "array", "description": "", "items": { "type": "number" } } } }, "discount_type": { "type": "string", "description": "Discount type, possible values:\n                        - simple" }, "discount_operating": { "type": "string", "description": "Action, possible values:\n                        - sum_with_other_discounts_to_orders - sum with other discounts assigned to orders,\n                        - use_only_if_greater_than_the_sum_of_other_discounts - use only if greater than the sum of other discounts" }, "discount_parameters": { "type": "array", "description": "", "items": { "type": "object", "properties": { "parameter_type": { "type": "string", "description": "Parameter type. - DEPRECATED" }, "parameter_value": { "type": "string", "description": "Parameter text ID. - DEPRECATED" }, "discount_value": { "type": "number", "description": "Size of discount.", "format": "decimal" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/prices/discounts",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_profitPoints_get", {
    name: "clients_profitPoints_get",
    description: `Method that enables extracting information about the amount of loyalty points collected by customers in a loyalty program.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientsIds": { "type": "array", "description": "Customer numbers.", "items": { "type": "number" } }, "clientTextSearch": { "type": "string", "description": "Text search through customer data." }, "clientIsActive": { "type": "string", "description": "Active", "enum": ["yes", "no"] }, "clientHasTradeCredit": { "type": "string", "description": "Trade credit:\n            - positive or negative,\n            - only positive,\n            - only negative,\n            - only zero.", "enum": ["nonzero", "positive", "negative", "zero"] }, "clientLastPurchaseDate": { "type": "object", "description": "Date of last purchase.", "properties": { "clientLastPurchaseDateBegin": { "type": "string", "description": "Start date (YYYY-MM-DD)." }, "clientLastPurchaseDateEnd": { "type": "string", "description": "End date (YYYY-MM-DD)." } } }, "pointsModificationDate": { "type": "object", "description": "Profit points modification date range.", "properties": { "dateBegin": { "type": "string", "description": "Modification date from (YYYY-MM-DD HH:mm:ss)" }, "dateEnd": { "type": "string", "description": "Modification date to (YYYY-MM-DD HH:mm:ss)" } } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned.\nAvailable elements:\n- clientId\n- clientProfitPoints\n- clientProfitPointsHistories", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/clients/profitPoints",
    executionParameters: [{ "name": "clientsIds", "in": "query" }, { "name": "clientTextSearch", "in": "query" }, { "name": "clientIsActive", "in": "query" }, { "name": "clientHasTradeCredit", "in": "query" }, { "name": "clientLastPurchaseDate", "in": "query" }, { "name": "pointsModificationDate", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_profitPoints_post", {
    name: "clients_profitPoints_post",
    description: `Method that allows for adding loyalty points to the balances of existing customer accounts.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "client_id": { "type": "number", "description": "" }, "operation": { "type": "string", "description": "Operation:\n\t\t\t\t- add,\n\t\t\t\t- remove." }, "score": { "type": "number", "description": "Amount of points to add or subtract.", "format": "float" }, "note": { "type": "string", "description": "" }, "order_number": { "type": "number", "description": "Prepayment ID." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/profitPoints",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_provinceList_get", {
    name: "clients_provinceList_get",
    description: `The method allows to retrieve the list of administrative regions available in the IdoSell administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "country_code": { "type": "string", "description": "Country code in ISO 3166-1 standard." } } },
    method: "get",
    pathTemplate: "/clients/provinceList",
    executionParameters: [{ "name": "country_code", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_remove_delete", {
    name: "clients_remove_delete",
    description: `This call is used to remove client's personal data and blocks the account.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientId": { "type": "number", "description": "Client's ID" } }, "required": ["clientId"] },
    method: "delete",
    pathTemplate: "/clients/remove",
    executionParameters: [{ "name": "clientId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_tags_clear_delete_post", {
    name: "clients_tags_clear_delete_post",
    description: `Use this method to delete all tags assigned to a customer
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clientId": { "type": "number", "description": "Unique client's number." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/tags/clear/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_tags_delete_post", {
    name: "clients_tags_delete_post",
    description: `Use this method to delete selected tags assigned to a customer
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "clientId": { "type": "number", "description": "Unique client's number." }, "tagId": { "type": "number", "description": "Tag ID." } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/tags/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_tags_get", {
    name: "clients_tags_get",
    description: `Use this method to retrieve all tags assigned to a client
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "clientId": { "type": "number", "description": "Unique client's number." } } },
    method: "get",
    pathTemplate: "/clients/tags",
    executionParameters: [{ "name": "clientId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_tags_put", {
    name: "clients_tags_put",
    description: `The method is used to update the value of the tags assigned to the client. A tag with value 0 is detached from the client
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "clientId": { "type": "number", "description": "Unique client's number." }, "clientTags": { "type": "array", "description": "", "items": { "type": "object", "properties": { "tagId": { "type": "number", "description": "Tag ID." }, "operation": { "type": "string", "description": "", "enum": ["add", "set", "subtract"] }, "tagValue": { "type": "number", "description": "Tag value." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/clients/tags",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["clients_tags_post", {
    name: "clients_tags_post",
    description: `Use this method to add new tags and their associated values to the client
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "clientId": { "type": "number", "description": "Unique client's number." }, "tagName": { "type": "string", "description": "Tag name." }, "tagValue": { "type": "number", "description": "Tag value." } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/clients/tags",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["config_variables_get", {
    name: "config_variables_get",
    description: `This call returns config variables for given module (type)
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "type": { "type": "string", "enum": ["snippets_campaign"], "description": "Which component is affected by the configuration." }, "item": { "type": "array", "description": "List of item identifiers for given configuration type. Eg. snippet campaign identifiers.", "items": { "type": "number" } }, "key": { "type": "array", "description": "List of configuration keys", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } }, "required": ["type"] },
    method: "get",
    pathTemplate: "/config/variables",
    executionParameters: [{ "name": "type", "in": "query" }, { "name": "item", "in": "query" }, { "name": "key", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["config_variables_put", {
    name: "config_variables_put",
    description: `Use this operation to update snippet campaigns.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "variables": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["type", "itemId", "key"], "allOf": [{ "type": "object", "allOf": [{ "properties": { "key": { "description": "Key of config value.", "type": "string", "maxLength": 255, "minLength": 1 }, "name": { "description": "Name of config item.", "type": "string", "maxLength": 255, "minLength": 1, "readOnly": true }, "value": { "description": "Value of config item.", "type": "string", "maxLength": 255, "minLength": 0 } }, "type": "object", "title": "ConfigVariableValue", "x-readme-ref-name": "ConfigVariableValue" }, { "properties": { "type": { "description": "The type of module for which the configuration is used", "type": "string", "enum": ["snippets_campaign"] }, "itemId": { "description": "Identifier of the item in used module", "type": "integer" }, "name": { "description": "Name of config item.", "type": "string", "maxLength": 255, "minLength": 1 } } }], "title": "ConfigVariable", "x-readme-ref-name": "ConfigVariable" }] } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/config/variables",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["config_variables_delete", {
    name: "config_variables_delete",
    description: `This call is used to remove defined configuration variables.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "type": { "type": "string", "enum": ["snippets_campaign"], "description": "Which component is affected by the configuration." }, "item": { "type": "array", "description": "List of item identifiers for given configuration type. Eg. snippet campaign identifiers.", "items": { "type": "number" } }, "key": { "type": "array", "description": "List of configuration keys", "items": { "type": "string" } } }, "required": ["type"] },
    method: "delete",
    pathTemplate: "/config/variables",
    executionParameters: [{ "name": "type", "in": "query" }, { "name": "item", "in": "query" }, { "name": "key", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["couriers_assignedToShippingProfiles_get", {
    name: "couriers_assignedToShippingProfiles_get",
    description: `Retrieves information about assigned couriers to delivery profiles
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/couriers/assignedToShippingProfiles",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["couriers_couriers_get", {
    name: "couriers_couriers_get",
    description: `Method that returns all couriers available for a given country. It also returns information whether the courier service handles personal collections.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "countryCode": { "type": "string", "description": "Country code in ISO 3166-1 standard." }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } }, "required": ["countryCode"] },
    method: "get",
    pathTemplate: "/couriers/couriers",
    executionParameters: [{ "name": "countryCode", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["couriers_pickupPoints_delete_post", {
    name: "couriers_pickupPoints_delete_post",
    description: `The method enables cancelling personal collection points within your own collection points chain. It does not allow for modifying integrated couriers collection points. 
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "pickupPointDeleteRequests": { "type": "array", "description": "", "items": { "type": "object", "properties": { "pickupPointId": { "type": "string", "description": "Collection point ID." }, "pickupPointExternalId": { "type": "string", "description": "external system code." }, "courierId": { "type": "number", "description": "Courier ID." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/couriers/pickupPoints/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["couriers_pickupPoints_get", {
    name: "couriers_pickupPoints_get",
    description: `The method returns personal collection points within its own network of collection points and for integrated couriers.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "courierId": { "type": "number", "description": "Courier ID." }, "pickupPointId": { "type": "string", "description": "Collection point ID." }, "pickupPointExternalId": { "type": "string", "description": "External system code." }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } }, "required": ["courierId"] },
    method: "get",
    pathTemplate: "/couriers/pickupPoints",
    executionParameters: [{ "name": "courierId", "in": "query" }, { "name": "pickupPointId", "in": "query" }, { "name": "pickupPointExternalId", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["couriers_pickupPoints_put", {
    name: "couriers_pickupPoints_put",
    description: `The method enables updating personal collection points within your own collection points chain. It does not allow for modifying integrated couriers collection points. 
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "pickupPoints": { "type": "array", "description": "", "items": { "type": "object", "properties": { "pickupPointId": { "type": "string", "description": "Collection point ID." }, "pickupPointExternalId": { "type": "string", "description": "external system code." }, "courierId": { "type": "number", "description": "Courier ID." }, "descriptions": { "type": "array", "description": "collection point details.", "items": { "type": "object", "properties": { "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "name": { "type": "string", "description": "Name of the pickup point." }, "description": { "type": "string", "description": "collection point description ." } } } }, "paymentForms": { "type": "array", "description": "Accepted payment types.", "items": { "type": "string", "description": "", "enum": ["cash", "card"] } }, "serviceStatus": { "type": "string", "description": "Collection point activity. Available values: available, outOfService .", "enum": ["out_of_service", "available"] }, "address": { "type": "object", "description": "Pickup point address.", "properties": { "street": { "type": "string", "description": "Address." }, "zipCode": { "type": "string", "description": "ZIP / Post code." }, "city": { "type": "string", "description": "Town / City." }, "provinceCode": { "type": "string", "description": "Administrative region (code in ISO 3166-2)." } } }, "coordinates": { "type": "object", "description": "Geographic coordinates.", "properties": { "longitude": { "type": "number", "description": "Longitude.", "format": "float" }, "latitude": { "type": "number", "description": "Latitude.", "format": "float" } } }, "operatingDays": { "type": "array", "description": "Personal collection point work hours.", "items": { "type": "object", "properties": { "weekday": { "type": "number", "description": "Days of the week designation.Day number: 1- Monday, 7 - Sunday." }, "opening": { "type": "string", "description": "collection point opening hours (HH:MM)." }, "closing": { "type": "string", "description": "collection point closing time (HH:MM)." }, "operatingMode": { "type": "string", "description": "#!trybPracyPunktuDostepneWartosciOpenInOtwartyOdDoClosedZamkniety24hCzynnyCalaDobe!#.", "enum": ["open_in", "closed", "24h"] } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/couriers/pickupPoints",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["couriers_pickupPoints_post", {
    name: "couriers_pickupPoints_post",
    description: `The method enables adding personal collection points within your own collection points chain. It does not allow for modifying integrated couriers collection points. 
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "pickupPoints": { "type": "array", "description": "", "items": { "type": "object", "properties": { "pickupPointExternalId": { "type": "string", "description": "external system code." }, "courierId": { "type": "number", "description": "Courier ID." }, "descriptions": { "type": "array", "description": "collection point details.", "items": { "type": "object", "properties": { "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "name": { "type": "string", "description": "Name of the pickup point." }, "description": { "type": "string", "description": "collection point description ." } } } }, "paymentForms": { "type": "array", "description": "Accepted payment types.", "items": { "type": "string", "description": "", "enum": ["cash", "card"] } }, "serviceStatus": { "type": "string", "description": "Collection point activity. Available values: available, outOfService .", "enum": ["out_of_service", "available"] }, "address": { "type": "object", "description": "Pickup point address.", "properties": { "street": { "type": "string", "description": "Address." }, "zipCode": { "type": "string", "description": "ZIP / Post code." }, "city": { "type": "string", "description": "Town / City." }, "provinceCode": { "type": "string", "description": "Administrative region (code in ISO 3166-2)." }, "countryCode": { "type": "string", "description": "Country code (ISO 3166-1 alpha-2)." } } }, "coordinates": { "type": "object", "description": "Geographic coordinates.", "properties": { "longitude": { "type": "number", "description": "Longitude.", "format": "float" }, "latitude": { "type": "number", "description": "Latitude.", "format": "float" } } }, "operatingDays": { "type": "array", "description": "Personal collection point work hours.", "items": { "type": "object", "properties": { "weekday": { "type": "number", "description": "Days of the week designation.Day number: 1- Monday, 7 - Sunday." }, "opening": { "type": "string", "description": "collection point opening hours (HH:MM)." }, "closing": { "type": "string", "description": "collection point closing time (HH:MM)." }, "operatingMode": { "type": "string", "description": "#!trybPracyPunktuDostepneWartosciOpenInOtwartyOdDoClosedZamkniety24hCzynnyCalaDobe!#.", "enum": ["open_in", "closed", "24h"] } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/couriers/pickupPoints",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["cpa_campaign_get", {
    name: "cpa_campaign_get",
    description: `This call returns all CPA campaigns.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "array", "description": "List of shop identifiers", "items": { "type": "number" } }, "id": { "type": "array", "description": "List of identifiers", "items": { "type": "number" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } } },
    method: "get",
    pathTemplate: "/cpa/campaign",
    executionParameters: [{ "name": "shopId", "in": "query" }, { "name": "id", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["cpa_campaign_put", {
    name: "cpa_campaign_put",
    description: `Use this operation to update CPA campaigns.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "campaigns": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["id"], "allOf": [{ "description": "A grouping element for snippets.", "properties": { "id": { "description": "Snippet campaign id", "type": "integer", "example": 1, "nullable": true }, "name": { "description": "Snippet campaign name", "type": "string" }, "description": { "description": "Snippet campaign internal description", "type": "string" }, "shop": { "description": "Shop ids where code snippets are active", "type": "array", "items": { "type": "integer" }, "example": [1], "nullable": true }, "active": { "description": "Whether the snippet is active", "type": "string", "enum": ["y", "n"] }, "cpaCount": { "description": "Number of CPA programs associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true }, "activeCpaCount": { "description": "Number of active CPA programs associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true } }, "type": "object", "title": "CpaCampaign", "x-readme-ref-name": "CpaCampaign" }] } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/cpa/campaign",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["cpa_campaign_post", {
    name: "cpa_campaign_post",
    description: `Use this operation to create cpa campaigns.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "campaigns": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["name"], "allOf": [{ "description": "A grouping element for snippets.", "properties": { "id": { "description": "Snippet campaign id", "type": "integer", "example": 1, "nullable": true }, "name": { "description": "Snippet campaign name", "type": "string" }, "description": { "description": "Snippet campaign internal description", "type": "string" }, "shop": { "description": "Shop ids where code snippets are active", "type": "array", "items": { "type": "integer" }, "example": [1], "nullable": true }, "active": { "description": "Whether the snippet is active", "type": "string", "enum": ["y", "n"] }, "cpaCount": { "description": "Number of CPA programs associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true }, "activeCpaCount": { "description": "Number of active CPA programs associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true } }, "type": "object", "title": "CpaCampaign", "x-readme-ref-name": "CpaCampaign" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/cpa/campaign",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["cpa_campaign_delete", {
    name: "cpa_campaign_delete",
    description: `This call is used to remove CPA program campaign.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "array", "description": "List of identifiers", "minLength": 1, "maxLength": 100, "items": { "type": "number" } } } },
    method: "delete",
    pathTemplate: "/cpa/campaign",
    executionParameters: [{ "name": "id", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["cpa_cpa_get", {
    name: "cpa_cpa_get",
    description: `This call returns all cpa programs.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "campaign": { "type": "array", "description": "List of campaign identifiers", "items": { "type": "number" } }, "id": { "type": "array", "description": "List of identifiers", "items": { "type": "number" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } } },
    method: "get",
    pathTemplate: "/cpa/cpa",
    executionParameters: [{ "name": "campaign", "in": "query" }, { "name": "id", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["cpa_cpa_put", {
    name: "cpa_cpa_put",
    description: `Use this operation to update code snippet.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "cpa": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["id"], "allOf": [{ "properties": { "id": { "description": "Id of the CPA program.", "type": "integer", "nullable": true }, "name": { "description": "The CPA program name.", "type": "string" }, "active": { "description": "Whether the CPA program is active.", "type": "string", "enum": ["y", "n"] }, "campaign": { "description": "CPA campaign id", "type": "integer" }, "pageSettings": { "description": "CPA program page settings simple or advanced, depending on the mode.", "oneOf": [{ "description": "Simple mode settings, in which the body is set for specific sites.", "type": "object", "allOf": [{ "description": "Abstract for CPA page settings", "required": ["mode"], "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["simple", "advanced"] } }, "type": "object", "discriminator": { "propertyName": "mode", "mapping": { "simple": "#/components/schemas/CpaSimplePageSettings", "advanced": "#/components/schemas/CpaAdvancedPageSettings" } }, "title": "CpaPageSettings", "x-readme-ref-name": "CpaPageSettings" }, { "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["simple"] }, "zone": { "description": "The place where the cpa code is loaded. (For \"all\" mode)", "type": "string", "enum": ["head", "bodyBegin", "bodyEnd"], "nullable": true }, "body": { "description": "Snippet content for each language. (For \"all\" mode)", "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" }, "nullable": true } } }], "title": "CpaSimplePageSettings", "x-readme-ref-name": "CpaSimplePageSettings" }, { "description": "Advanced mode settings, in which the body is set for specific sites.", "type": "object", "allOf": [{ "description": "Abstract for CPA page settings", "required": ["mode"], "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["simple", "advanced"] } }, "type": "object", "discriminator": { "propertyName": "mode", "mapping": { "simple": "#/components/schemas/CpaSimplePageSettings", "advanced": "#/components/schemas/CpaAdvancedPageSettings" } }, "title": "CpaPageSettings", "x-readme-ref-name": "CpaPageSettings" }, { "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["advanced"] }, "pages": { "description": "Page setting for advance mode", "type": "array", "items": { "properties": { "active": { "type": "string", "enum": ["y", "n"] }, "page": { "type": "string", "enum": ["home", "basket", "checkout_payment_delivery", "checkout_confirmation", "new_order_placement", "order_details", "navigation", "product_details", "search_results", "after_order_place", "mailing_subscribe", "other_pages"] }, "zone": { "description": "The place where the cpa code is loaded. (For \"all\" mode)", "type": "string", "enum": ["head", "bodyBegin", "bodyEnd"] }, "body": { "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" } } }, "type": "object", "title": "CpaPage", "x-readme-ref-name": "CpaPage" } } } }], "title": "CpaAdvancedPageSettings", "x-readme-ref-name": "CpaAdvancedPageSettings" }] }, "display": { "properties": { "clientType": { "description": "Type of customers to whom to display the snippet", "type": "string", "enum": ["all", "unregistered", "registered", "retailer", "wholesaler"] }, "newsletter": { "description": "Whether to display only for newsletter visitors.", "type": "string", "enum": ["y", "n", "all"] }, "hasOrders": { "description": "Whether to display the code snippet only for customers who have placed an order", "type": "string", "enum": ["y", "n", "all"] }, "useRebateCode": { "description": "Display only after entering rebate code", "type": "string", "enum": ["y", "n", "all"] } }, "type": "object", "title": "DisplaySettings", "x-readme-ref-name": "DisplaySettings" }, "sources": { "description": "Snippet entry source filter.", "properties": { "direct": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "search": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "advert": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "priceComparers": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "affiliate": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "cpa": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "newsletter": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "social": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "page": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true } }, "type": "object", "title": "SnippetSourcesSettings", "x-readme-ref-name": "SnippetSourcesSettings" }, "variables": { "description": "List of variables that can be used in a body template.", "type": "array", "items": { "properties": { "name": { "type": "string", "maxLength": 150 }, "source": { "type": "string", "enum": ["session", "cookie"] } }, "type": "object", "title": "CpaVariable", "x-readme-ref-name": "CpaVariable" } } }, "type": "object", "externalDocs": { "description": "Idosell.com", "url": "https://www.idosell.com/en/developers/cpa-programs/" }, "title": "Cpa", "x-readme-ref-name": "Cpa" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/cpa/cpa",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["cpa_cpa_post", {
    name: "cpa_cpa_post",
    description: `Use this operation to create code snippet.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "cpa": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["campaign", "name"], "allOf": [{ "properties": { "id": { "description": "Id of the CPA program.", "type": "integer", "nullable": true }, "name": { "description": "The CPA program name.", "type": "string" }, "active": { "description": "Whether the CPA program is active.", "type": "string", "enum": ["y", "n"] }, "campaign": { "description": "CPA campaign id", "type": "integer" }, "pageSettings": { "description": "CPA program page settings simple or advanced, depending on the mode.", "oneOf": [{ "description": "Simple mode settings, in which the body is set for specific sites.", "type": "object", "allOf": [{ "description": "Abstract for CPA page settings", "required": ["mode"], "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["simple", "advanced"] } }, "type": "object", "discriminator": { "propertyName": "mode", "mapping": { "simple": "#/components/schemas/CpaSimplePageSettings", "advanced": "#/components/schemas/CpaAdvancedPageSettings" } }, "title": "CpaPageSettings", "x-readme-ref-name": "CpaPageSettings" }, { "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["simple"] }, "zone": { "description": "The place where the cpa code is loaded. (For \"all\" mode)", "type": "string", "enum": ["head", "bodyBegin", "bodyEnd"], "nullable": true }, "body": { "description": "Snippet content for each language. (For \"all\" mode)", "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" }, "nullable": true } } }], "title": "CpaSimplePageSettings", "x-readme-ref-name": "CpaSimplePageSettings" }, { "description": "Advanced mode settings, in which the body is set for specific sites.", "type": "object", "allOf": [{ "description": "Abstract for CPA page settings", "required": ["mode"], "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["simple", "advanced"] } }, "type": "object", "discriminator": { "propertyName": "mode", "mapping": { "simple": "#/components/schemas/CpaSimplePageSettings", "advanced": "#/components/schemas/CpaAdvancedPageSettings" } }, "title": "CpaPageSettings", "x-readme-ref-name": "CpaPageSettings" }, { "properties": { "mode": { "description": "Whether to display to all sites.", "type": "string", "enum": ["advanced"] }, "pages": { "description": "Page setting for advance mode", "type": "array", "items": { "properties": { "active": { "type": "string", "enum": ["y", "n"] }, "page": { "type": "string", "enum": ["home", "basket", "checkout_payment_delivery", "checkout_confirmation", "new_order_placement", "order_details", "navigation", "product_details", "search_results", "after_order_place", "mailing_subscribe", "other_pages"] }, "zone": { "description": "The place where the cpa code is loaded. (For \"all\" mode)", "type": "string", "enum": ["head", "bodyBegin", "bodyEnd"] }, "body": { "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" } } }, "type": "object", "title": "CpaPage", "x-readme-ref-name": "CpaPage" } } } }], "title": "CpaAdvancedPageSettings", "x-readme-ref-name": "CpaAdvancedPageSettings" }] }, "display": { "properties": { "clientType": { "description": "Type of customers to whom to display the snippet", "type": "string", "enum": ["all", "unregistered", "registered", "retailer", "wholesaler"] }, "newsletter": { "description": "Whether to display only for newsletter visitors.", "type": "string", "enum": ["y", "n", "all"] }, "hasOrders": { "description": "Whether to display the code snippet only for customers who have placed an order", "type": "string", "enum": ["y", "n", "all"] }, "useRebateCode": { "description": "Display only after entering rebate code", "type": "string", "enum": ["y", "n", "all"] } }, "type": "object", "title": "DisplaySettings", "x-readme-ref-name": "DisplaySettings" }, "sources": { "description": "Snippet entry source filter.", "properties": { "direct": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "search": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "advert": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "priceComparers": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "affiliate": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "cpa": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "newsletter": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "social": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "page": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true } }, "type": "object", "title": "SnippetSourcesSettings", "x-readme-ref-name": "SnippetSourcesSettings" }, "variables": { "description": "List of variables that can be used in a body template.", "type": "array", "items": { "properties": { "name": { "type": "string", "maxLength": 150 }, "source": { "type": "string", "enum": ["session", "cookie"] } }, "type": "object", "title": "CpaVariable", "x-readme-ref-name": "CpaVariable" } } }, "type": "object", "externalDocs": { "description": "Idosell.com", "url": "https://www.idosell.com/en/developers/cpa-programs/" }, "title": "Cpa", "x-readme-ref-name": "Cpa" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/cpa/cpa",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["cpa_cpa_delete", {
    name: "cpa_cpa_delete",
    description: `This call is used to remove CPA programs.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "array", "description": "List of identifiers", "minLength": 1, "maxLength": 100, "items": { "type": "number" } } } },
    method: "delete",
    pathTemplate: "/cpa/cpa",
    executionParameters: [{ "name": "id", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["deliveries_defaultProfiles_put", {
    name: "deliveries_defaultProfiles_put",
    description: `The method allows to set the default delivery profile for the given region.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "regionId": { "type": "number", "description": "Country ID" }, "shopId": { "type": "number", "description": "Shop Id" }, "retailProfileId": { "type": "number", "description": "ID of delivery profile for retail sales " }, "wholesaleProfileId": { "type": "number", "description": "ID of delivery profile for wholesale sales " } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/deliveries/defaultProfiles",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["deliveries_profiles_get", {
    name: "deliveries_profiles_get",
    description: `Allows to download all of the delivery profiles defined in the administration panel
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/deliveries/profiles",
    executionParameters: [{ "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["deliveries_regions_get", {
    name: "deliveries_regions_get",
    description: `The method allows to download a list of regions supporting deliveries.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" } } },
    method: "get",
    pathTemplate: "/deliveries/regions",
    executionParameters: [{ "name": "shopId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["deliveries_regions_post", {
    name: "deliveries_regions_post",
    description: `Allows you to add a region to the indicated country
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "regionName": { "type": "string", "description": "Name of the region in the panel" }, "shopId": { "type": "number", "description": "Shop Id" }, "postCodeFrom": { "type": "string", "description": "The range of postal codes from %s" }, "postCodeTo": { "type": "string", "description": "The range of postal codes to %s" }, "parentRegionId": { "type": "number", "description": "ID of the country for which the region is being added" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/deliveries/regions",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["discounts_groups_clients_get", {
    name: "discounts_groups_clients_get",
    description: `Returns the list of customer IDs assigned to an indicated discount group. In order to assign a discount group, use setClients method in API Clients.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "discountGroupId": { "type": "number", "description": "Discount group ID" } }, "required": ["discountGroupId"] },
    method: "get",
    pathTemplate: "/discounts/groups/clients",
    executionParameters: [{ "name": "discountGroupId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_groups_delete_post", {
    name: "discounts_groups_delete_post",
    description: `Allows to remove a discount group. The condition for conducting this process is no customers assigned to the indicated group. In order to check the assigned customers use getClientsAssignedToDiscountGroup method. 
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "discountGroupId": { "type": "number", "description": "Discount group ID" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/discounts/groups/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_groups_get", {
    name: "discounts_groups_get",
    description: `Method that enables extracting information about discount groups configured in the administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "groupNumbers": { "type": "array", "description": "", "items": { "type": "number" } }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned.\nAvailable elements:\n- groupNumber\n- groupCombined\n- groupType\n- groupRebate\n- groupName", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Results page number. Numbering begins at 0. Default value: 0." }, "resultsLimit": { "type": "number", "description": "Maximum number of results on a single page. Default is 100." } } },
    method: "get",
    pathTemplate: "/discounts/groups",
    executionParameters: [{ "name": "groupNumbers", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_groups_put", {
    name: "discounts_groups_put",
    description: `Allows to change a discount group name
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "discountGroupId": { "type": "number", "description": "Discount group ID" }, "discountGroupName": { "type": "string", "description": "Discount group name" } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/discounts/groups",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_groups_post", {
    name: "discounts_groups_post",
    description: `Allows to add a new discount group in the administration panel. The discount group is added by default with the setting "Discount for products - yes, but different for indicated groups".
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "discountGroupName": { "type": "string", "description": "Discount group name" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/discounts/groups",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_groups_products_delete_post", {
    name: "discounts_groups_products_delete_post",
    description: `The method allows the removal of products from a discount group
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "discountGroupId": { "type": "number", "description": "Discount group ID" }, "products": { "type": "array", "description": "Products list.", "items": { "type": "number" } }, "producers": { "type": "array", "description": "Brands", "items": { "type": "number" } }, "series": { "type": "array", "description": "Series", "items": { "type": "number" } }, "categories": { "type": "array", "description": "List of categories in which sought products are present.", "items": { "type": "number" } }, "menuItems": { "type": "array", "description": "Menu elements", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/discounts/groups/products/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_groups_products_put", {
    name: "discounts_groups_products_put",
    description: `The method allows products to be added to a discount group and their price to be specified in the discount group
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "discountGroupId": { "type": "number", "description": "Discount group ID" }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "ID" }, "price": { "type": "number", "description": "Price", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } } }, "producers": { "type": "array", "description": "Brands", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "ID" }, "price": { "type": "number", "description": "Price", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } } }, "series": { "type": "array", "description": "Series", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "ID" }, "price": { "type": "number", "description": "Price", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } } }, "categories": { "type": "array", "description": "List of categories in which sought products are present.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "ID" }, "price": { "type": "number", "description": "Price", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } } }, "menuItems": { "type": "array", "description": "Menu elements", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "ID" }, "price": { "type": "number", "description": "Price", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/discounts/groups/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_rebates_blockCard_put", {
    name: "discounts_rebates_blockCard_put",
    description: `Allows to block an indicated discount card, eg. when it is assumed that its number has been made available publicly. The blocked card can be unblocked with the method unblockRebateCard.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "card_number": { "type": "string", "description": "Card number" } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/discounts/rebates/blockCard",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_rebates_card_delete_post", {
    name: "discounts_rebates_card_delete_post",
    description: `Method allows to quickly delete all the discount codes, which have never been used by customers, from an indicated rebate campaign. Codes which have been used at least once, will not be deleted.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "campaign_id": { "type": "number", "description": "Discount card type" } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/discounts/rebates/card/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_rebates_card_post", {
    name: "discounts_rebates_card_post",
    description: `Allows to upload new card numbers to already existing discount card types in the administration panel. Cards uploaded such way retrieve settings, regarding the discount amount, from the type of cards to which they are uploaded. Every card can also have individual, independent discount settings which can be set in the administration panel..
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "campaign_id": { "type": "number", "description": "Discount card type" }, "card_number": { "type": "string", "description": "Card number" } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/discounts/rebates/card",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_rebates_code_delete_post", {
    name: "discounts_rebates_code_delete_post",
    description: `Allows to quickly delete all the discount codes, which have never been used by customers, from an indicated rebate campaign. Codes which have been used at least once, will not be deleted.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "campaign_id": { "type": "number", "description": "Campaign ID" } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/discounts/rebates/code/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_rebates_code_post", {
    name: "discounts_rebates_code_post",
    description: `Allows to upload new code numbers to already existing rebate campaigns in the administration panel. The codes uploaded in such way retrieve settings, regarding the discount amount, from a campaign to which they are uploaded. Each discount code can also have individual, independent discount settings which can be set in the administration panel.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "campaign_id": { "type": "number", "description": "Campaign ID" }, "code_number": { "type": "string", "description": "Code" } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/discounts/rebates/code",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["discounts_rebates_unblockCard_put", {
    name: "discounts_rebates_unblockCard_put",
    description: `unblockRebateCard method - allows to unblock discount cards. Block cards with the blockRebateCard method.
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "card_number": { "type": "string", "description": "Card number" } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/discounts/rebates/unblockCard",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["entries_entries_delete_post", {
    name: "entries_entries_delete_post",
    description: `Enables deleting blog or news entry
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "entryId": { "type": "number", "description": "Entry ID" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/entries/entries/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["entries_entries_get", {
    name: "entries_entries_get",
    description: `Enables downloading blog or news entry data
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "entryId": { "type": "number", "description": "Entry ID" }, "langId": { "type": "string", "description": "Language ID" } } },
    method: "get",
    pathTemplate: "/entries/entries",
    executionParameters: [{ "name": "entryId", "in": "query" }, { "name": "langId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["entries_entries_put", {
    name: "entries_entries_put",
    description: `Enables changing blog or news entry in the shop
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "entryId": { "type": "number", "description": "Entry ID" }, "shopId": { "type": "number", "description": "Shop Id" }, "date": { "type": "string", "description": "Date of creating an entry" }, "visible": { "type": "string", "description": "Entry visibility", "enum": ["y", "n"] }, "visibleOnSitesList": { "type": "array", "description": "List of pages on which the entry is to be published", "items": { "type": "object", "properties": { "siteId": { "type": "string", "description": "Page ID" } } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Merchandise identifier" } } } }, "pictureData": { "type": "object", "description": "Photo", "properties": { "pictureBase64": { "type": "string", "description": "Photo encoded with Base64" }, "pictureFormat": { "type": "string", "description": "Photo format", "enum": ["jpg", "jpeg", "png", "gif"] } } }, "deletePicture": { "type": "string", "description": "Determines whether to delete an entry photo", "enum": ["y", "n"] }, "langs": { "type": "array", "description": "Element including entry content in selected languages", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "title": { "type": "string", "description": "Name on the page" }, "shortDescription": { "type": "string", "description": "short description" }, "longDescription": { "type": "string", "description": "Long description" }, "blogUrl": { "type": "string", "description": "Blog post URL" }, "newsUrl": { "type": "string", "description": "News item URL" }, "metaTitle": { "type": "string", "description": "Meta title of the entry" }, "metaDescription": { "type": "string", "description": "Meta description of the entry" }, "metaKeywords": { "type": "string", "description": "Meta keywords of the entry" } } } }, "titleLinkType": { "type": "string", "description": "Type of title and shortcut linking: fullContentLink - link to the subpage with full content, givenUrlLink - link to the given URL, noLink - static element", "enum": ["fullContentLink", "givenUrlLink", "noLink"] }, "link": { "type": "string", "description": "Provided URL (for link to specified URL option)" } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/entries/entries",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["entries_entries_post", {
    name: "entries_entries_post",
    description: `Enables adding blog or news entry 
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "date": { "type": "string", "description": "Date of creating an entry" }, "visible": { "type": "string", "description": "Entry visibility", "enum": ["y", "n"] }, "visibleOnSitesList": { "type": "array", "description": "List of pages on which the entry is to be published", "items": { "type": "object", "properties": { "siteId": { "type": "string", "description": "Site ID" } } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Merchandise identifier" } } } }, "pictureData": { "type": "object", "description": "Photo", "properties": { "pictureBase64": { "type": "string", "description": "Photo encoded with Base64" }, "pictureFormat": { "type": "string", "description": "Photo format", "enum": ["jpg", "jpeg", "png", "gif"] } } }, "langs": { "type": "array", "description": "Element including entry content in selected languages", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "title": { "type": "string", "description": "Name on the page" }, "shortDescription": { "type": "string", "description": "short description" }, "longDescription": { "type": "string", "description": "Long description" }, "blogUrl": { "type": "string", "description": "Blog post URL" }, "newsUrl": { "type": "string", "description": "News item URL" }, "metaTitle": { "type": "string", "description": "Meta title of the entry" }, "metaDescription": { "type": "string", "description": "Meta description of the entry" }, "metaKeywords": { "type": "string", "description": "Meta keywords of the entry" } } } }, "titleLinkType": { "type": "string", "description": "Type of title and shortcut linking: fullContentLink - link to the subpage with full content, givenUrlLink - link to the given URL, noLink - static element", "enum": ["fullContentLink", "givenUrlLink", "noLink"] }, "link": { "type": "string", "description": "Provided URL (for link to specified URL option)" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/entries/entries",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["entries_pagesToDisplay_get", {
    name: "entries_pagesToDisplay_get",
    description: `Allows you to download a list of sites on which a blog entry or a news item can be published.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" } } },
    method: "get",
    pathTemplate: "/entries/pagesToDisplay",
    executionParameters: [{ "name": "langId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["entries_sources_get", {
    name: "entries_sources_get",
    description: `This call returns all entry sources with options.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "type": { "type": "array", "description": "The type of source for which we want to get service identifiers", "items": { "type": "string", "enum": ["search", "advert", "priceComparers", "cpa", "newsletter", "social"] } } } },
    method: "get",
    pathTemplate: "/entries/sources",
    executionParameters: [{ "name": "type", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["icons_list_post", {
    name: "icons_list_post",
    description: `List of icons assigned to product.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Product icons list request", "properties": { "productId": { "type": "number" }, "shopId": { "type": "number" }, "iconsMacroType": { "type": "string", "enum": ["small", "large"] }, "inTrash": { "type": "boolean" }, "langId": { "type": "string", "pattern": "^[a-z]{3}$" }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" } }, "type": "object", "title": "ProductIconsViewRequest", "x-readme-ref-name": "ProductIconsViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/icons/list",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["menu_filter_get", {
    name: "menu_filter_get",
    description: `The method returns information about filter settings in menu nodes.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "productMenuTreeId": { "type": "number", "description": "Tree menu ID." }, "productMenuNodeId": { "type": "number", "description": "Menu element ID." } } },
    method: "get",
    pathTemplate: "/menu/filter",
    executionParameters: [{ "name": "shopId", "in": "query" }, { "name": "languageId", "in": "query" }, { "name": "productMenuTreeId", "in": "query" }, { "name": "productMenuNodeId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["menu_filter_put", {
    name: "menu_filter_put",
    description: `The method allows you to manage filter settings in menu nodes.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "productMenuTreeId": { "type": "number", "description": "Tree menu ID." }, "productMenuNodeId": { "type": "number", "description": "Menu element ID." }, "filterForMenuNodeIsDefault": { "type": "string", "description": "Default filter settings.", "enum": ["y", "n"] }, "menuFiltersActive": { "type": "array", "description": "Active filters.", "items": { "type": "object", "properties": { "menuFilterId": { "type": "string", "description": "Menu filter ID." }, "menuFilterName": { "type": "string", "description": "Filter name on page." }, "menuFilterDisplay": { "type": "string", "description": "Display as: \"name\" - text, \"gfx\" - graphics, \"namegfx\" - text and graphics.", "enum": ["name", "gfx", "namegfx"] }, "menuFilterValueSort": { "type": "string", "description": "Sort by: \"y\" - alfabetically, \"n\" - by frequency and order of occurrence of indicated parameter value in found products, \"priority\" - according to value sequence in parameter.", "enum": ["y", "n", "priority"] }, "menuFilterDefaultEnabled": { "type": "string", "description": "Enabled by default .", "enum": ["y", "n"] } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/menu/filter",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["menu_menu_delete_post", {
    name: "menu_menu_delete_post",
    description: `Method that enables deleting existing menu elements.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "menu_list": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id." }, "menu_id": { "type": "number", "description": "Menu ID." }, "item_id": { "type": "number", "description": "Menu element ID." }, "item_textid": { "type": "string", "description": "Menu element text identifier.\n                    Example: \"item1\\item2\\item3\"." } } } }, "settings": { "type": "object", "description": "Settings.", "properties": { "textid_separator": { "type": "string", "description": "Default: \"\\\"." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/menu/menu/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["menu_menu_get", {
    name: "menu_menu_get",
    description: `Method that returns information about menus and menu elements.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id." }, "menu_id": { "type": "number", "description": "Tree menu ID." }, "lang_id": { "type": "string", "description": "Language ID." }, "node_id": { "type": "number", "description": "Menu node ID." }, "level": { "type": "number", "description": "Number of levels." }, "textid_separator": { "type": "string", "description": "Default: \"\\\"." } } },
    method: "get",
    pathTemplate: "/menu/menu",
    executionParameters: [{ "name": "shop_id", "in": "query" }, { "name": "menu_id", "in": "query" }, { "name": "lang_id", "in": "query" }, { "name": "node_id", "in": "query" }, { "name": "level", "in": "query" }, { "name": "textid_separator", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["menu_menu_put", {
    name: "menu_menu_put",
    description: `Method that enables editing existing menu elements.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "menu_list": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id." }, "menu_id": { "type": "number", "description": "Menu ID." }, "item_id": { "type": "string", "description": "Menu element ID." }, "item_textid": { "type": "string", "description": "Menu element text identifier.\n                Example: \"item1\\item2\\item3\"." }, "lang_data": { "type": "array", "description": "", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID." }, "name": { "type": "string", "description": "Menu element name." }, "priority": { "type": "number", "description": "Menu element order." }, "description": { "type": "string", "description": "Description displayed at the top of products list." }, "description_bottom": { "type": "string", "description": "Description displayed at the bottom of products list." }, "link": { "type": "string", "description": "Own link." }, "item_type": { "type": "string", "description": "", "enum": ["products", "navigation", "products_with_rich_text", "navigation_with_rich_text", "rich_text", "static", "link"] }, "meta_title": { "type": "string", "description": "Meta title  ." }, "meta_description": { "type": "string", "description": "Meta description." }, "meta_keywords": { "type": "string", "description": "Meta - keywords." }, "url": { "type": "string", "description": "URL address" }, "href_target": { "type": "string", "description": "Link target attribute:\n                !_self - open on the same page,\n                !_blank - open in a new page.", "enum": ["_self", "_blank"] }, "sort": { "type": "array", "description": "", "items": { "type": "object", "properties": { "view": { "type": "string", "description": "Default product list view.", "enum": ["normal", "list", "gallery"] }, "sort_by": { "type": "string", "description": "Sort by.", "enum": ["date", "priority", "priorityname", "name", "price"] }, "sort_order": { "type": "string", "description": "Sort order.", "enum": ["ASC", "DESC"] } } } }, "display_limit": { "type": "array", "description": "", "items": { "type": "object", "properties": { "view": { "type": "string", "description": "Default product list view.", "enum": ["normal", "list", "gallery"] }, "limit": { "type": "number", "description": "Limit." } } } }, "default_view": { "type": "string", "description": "", "enum": ["normal", "list", "gallery"] }, "headline_name": { "type": "string", "description": "Headline name. Leaving this value empty will automatically generate name basing on a name in menu." }, "expand": { "type": "string", "description": "Display by default nested elements.\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "hidden": { "type": "string", "description": "Element of the menu hidden from the clients:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "action": { "type": "string", "description": "After clicking on the element in the menu::\n                expand - Display subelements of the menu if any available, if not - create,\n                reload - reload the page and open.", "enum": ["reload", "expand"] }, "display_all_type": { "type": "string", "description": "Element \"show all\" is::\n                products_list - link to the list of products,\n                navigation_site - link to the \"Navigation\" page.", "enum": ["products_list", "navigation_site"] }, "display_all": { "type": "string", "description": "Display element \"show all\":\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "allow_sort_change": { "type": "string", "description": "Disable changing \"sort by\" for customers:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "allow_limit_change": { "type": "string", "description": "Disable possibility of changing the number of displayed products on the page by customers :\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "node_gfx": { "type": "string", "description": "Graphics in menu:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "gfx_active_type": { "type": "string", "description": "Type of graphics - When the cursor is on the link:\n                img - Image (one size for computers, tablets and smartphones, not recommended),\n                img_rwd - Image (three sizes for RWD).", "enum": ["img", "img_rwd"] }, "gfx_inactive_type": { "type": "string", "description": "Type of graphics - When the cursor is outside link:\n                img - Image (one size for computers, tablets and smartphones, not recommended),\n                img_rwd - Image (three sizes for RWD).", "enum": ["img", "img_rwd"] }, "gfx_omo_type": { "type": "string", "description": "Type of graphics - When the link is opened:\n                img - Image (one size for computers, tablets and smartphones, not recommended),\n                img_rwd - Image (three sizes for RWD).", "enum": ["img", "img_rwd"] }, "gfx_nav": { "type": "object", "description": "Graphic on the \"navigation\" page.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active": { "type": "object", "description": "Graphic - When the cursor is on the link.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active_desktop": { "type": "object", "description": "Graphic - When the cursor is on the link - Desktop.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active_tablet": { "type": "object", "description": "Graphic - When the cursor is on the link - Tablet.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active_mobile": { "type": "object", "description": "Graphic - When the cursor is on the link - Mobile.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx": { "type": "object", "description": "Graphic - When the cursor is outside link.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_inactive_desktop": { "type": "object", "description": "Graphic - When the cursor is outside link - Desktop.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_inactive_tablet": { "type": "object", "description": "Graphic - When the cursor is outside link - Tablet.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_inactive_mobile": { "type": "object", "description": "Graphic - When the cursor is outside link - Mobile.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_onmouseover": { "type": "object", "description": "Graphic - When the link is opened.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_omo_desktop": { "type": "object", "description": "Graphic - When the link is opened - Desktop.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_omo_tablet": { "type": "object", "description": "Graphic - When the link is opened - Tablet.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_omo_mobile": { "type": "object", "description": "Graphic - When the link is opened - Mobile.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "canonical_to_parent": { "type": "string", "description": "Add a canonical link that points to the parent menu item:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "meta_robots_index": { "type": "string", "description": "Meta robots index settings:\n                default - automatically generate,\n                index - index,\n                noindex - noindex.", "enum": ["default", "index", "noindex"] }, "meta_robots_follow": { "type": "string", "description": "Meta robots follow settings:\n                default - automatically generate,\n                follow - follow,\n                nofollow - nofollow.", "enum": ["default", "follow", "nofollow"] } } } } } } }, "settings": { "type": "object", "description": "Settings.", "properties": { "textid_separator": { "type": "string", "description": "Default: \"\\\"." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/menu/menu",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["menu_menu_post", {
    name: "menu_menu_post",
    description: `Method that enables adding new menu elements.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "menu_list": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id." }, "menu_id": { "type": "number", "description": "Menu ID." }, "parent_id": { "type": "string", "description": "Parent menu element ID." }, "parent_textid": { "type": "string", "description": "Menu element text identifier.\n                Example: \"item1\\item2\"." }, "lang_data": { "type": "array", "description": "", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID." }, "name": { "type": "string", "description": "Menu element name." }, "priority": { "type": "number", "description": "Menu element order." }, "description": { "type": "string", "description": "Description displayed at the top of products list." }, "description_bottom": { "type": "string", "description": "Description displayed at the bottom of products list." }, "link": { "type": "string", "description": "Own link." }, "item_type": { "type": "string", "description": "", "enum": ["products", "navigation", "products_with_rich_text", "navigation_with_rich_text", "rich_text", "static", "link"] }, "meta_title": { "type": "string", "description": "Meta - title." }, "meta_description": { "type": "string", "description": "Meta description." }, "meta_keywords": { "type": "string", "description": "Meta - keywords." }, "url": { "type": "string", "description": "URL address" }, "href_target": { "type": "string", "description": "Link target attribute:\n                !_self - open on the same page,\n                !_blank - open in a new page.", "enum": ["_self", "_blank"] }, "sort": { "type": "array", "description": "", "items": { "type": "object", "properties": { "view": { "type": "string", "description": "Default product list view.", "enum": ["normal", "list", "gallery"] }, "sort_by": { "type": "string", "description": "Sort by.", "enum": ["date", "priority", "priorityname", "name", "price"] }, "sort_order": { "type": "string", "description": "Sort order.", "enum": ["ASC", "DESC"] } } } }, "display_limit": { "type": "array", "description": "", "items": { "type": "object", "properties": { "view": { "type": "string", "description": "Default product list view.", "enum": ["normal", "list", "gallery"] }, "limit": { "type": "number", "description": "Limit." } } } }, "default_view": { "type": "string", "description": "", "enum": ["normal", "list", "gallery"] }, "headline_name": { "type": "string", "description": "Headline name. Leaving this value empty will automatically generate name basing on a name in menu." }, "expand": { "type": "string", "description": "Display by default nested elements.\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "hidden": { "type": "string", "description": "Element of the menu hidden from the clients:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "action": { "type": "string", "description": "After clicking on the element in the menu::\n                expand - Display subelements of the menu if any available, if not - create,\n                reload - reload the page and open.", "enum": ["reload", "expand"] }, "display_all_type": { "type": "string", "description": "Element \"show all\" is::\n                products_list - link to the list of products,\n                navigation_site - link to the \"Navigation\" page.", "enum": ["products_list", "navigation_site"] }, "display_all": { "type": "string", "description": "Display element \"show all\":\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "allow_sort_change": { "type": "string", "description": "Disable changing \"sort by\" for customers:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "allow_limit_change": { "type": "string", "description": "Disable possibility of changing the number of displayed products on the page by customers :\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "node_gfx": { "type": "string", "description": "Graphics in menu:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "gfx_active_type": { "type": "string", "description": "Type of graphics - When the cursor is on the link:\n                img - Image (one size for computers, tablets and smartphones, not recommended),\n                img_rwd - Image (three sizes for RWD).", "enum": ["img", "img_rwd"] }, "gfx_inactive_type": { "type": "string", "description": "Type of graphics - When the cursor is outside link:\n                img - Image (one size for computers, tablets and smartphones, not recommended),\n                img_rwd - Image (three sizes for RWD).", "enum": ["img", "img_rwd"] }, "gfx_omo_type": { "type": "string", "description": "Type of graphics - When the link is opened:\n                img - Image (one size for computers, tablets and smartphones, not recommended),\n                img_rwd - Image (three sizes for RWD).", "enum": ["img", "img_rwd"] }, "gfx_nav": { "type": "object", "description": "Graphic on the \"navigation\" page.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active": { "type": "object", "description": "Graphic - When the cursor is on the link.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active_desktop": { "type": "object", "description": "Graphic - When the cursor is on the link - Desktop.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active_tablet": { "type": "object", "description": "Graphic - When the cursor is on the link - Tablet.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_active_mobile": { "type": "object", "description": "Graphic - When the cursor is on the link - Mobile.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx": { "type": "object", "description": "Graphic - When the cursor is outside link.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_inactive_desktop": { "type": "object", "description": "Graphic - When the cursor is outside link - Desktop.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_inactive_tablet": { "type": "object", "description": "Graphic - When the cursor is outside link - Tablet.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_inactive_mobile": { "type": "object", "description": "Graphic - When the cursor is outside link - Mobile.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_onmouseover": { "type": "object", "description": "Graphic - When the link is opened.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_omo_desktop": { "type": "object", "description": "Graphic - When the link is opened - Desktop.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_omo_tablet": { "type": "object", "description": "Graphic - When the link is opened - Tablet.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "gfx_omo_mobile": { "type": "object", "description": "Graphic - When the link is opened - Mobile.", "properties": { "base64": { "type": "string", "description": "Graphic encoded with Base64" }, "format": { "type": "string", "description": "Graphic format", "enum": ["jpg", "jpeg", "png", "gif", "svg", "webp"] } } }, "canonical_to_parent": { "type": "string", "description": "Add a canonical link that points to the parent menu item:\n                n - no,\n                y - yes.", "enum": ["n", "y"] }, "meta_robots_index": { "type": "string", "description": "Meta robots index settings:\n                default - automatically generate,\n                index - index,\n                noindex - noindex.", "enum": ["default", "index", "noindex"] }, "meta_robots_follow": { "type": "string", "description": "Meta robots follow settings:\n                default - automatically generate,\n                follow - follow,\n                nofollow - nofollow.", "enum": ["default", "follow", "nofollow"] } } } } } } }, "settings": { "type": "object", "description": "Settings", "properties": { "textid_separator": { "type": "string", "description": "Default: \"\\\"." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/menu/menu",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["menu_sort_put", {
    name: "menu_sort_put",
    description: `Method that enables sorting of menu elements.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "menu_list": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id." }, "menu_id": { "type": "number", "description": "Menu ID." }, "lang_id": { "type": "string", "description": "Language ID." }, "parent_id": { "type": "number", "description": "Menu element text identifier." }, "parent_textid": { "type": "string", "description": "Menu element text identifier.\n                    Example: \"item1\\item2\\item3\"." }, "recursive": { "type": "string", "description": "Recurring: y/n!", "enum": ["y", "n"] } } } }, "settings": { "type": "object", "description": "Settings", "properties": { "textid_separator": { "type": "string", "description": "Default: \"\\\"." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/menu/sort",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["orders_analytics_get", {
    name: "orders_analytics_get",
    description: `The method is used to retrieve information about the margins of the goods of the order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "orderSerialNumber": { "type": "array", "description": "Array of order serial numbers.", "items": { "type": "number", "description": "Order serial number." } } } },
    method: "get",
    pathTemplate: "/orders/analytics",
    executionParameters: [{ "name": "orderSerialNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_auctionDetails_get", {
    name: "orders_auctionDetails_get",
    description: `Method that enables getting information about external listings assigned to orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "enum": ["orders_id", "orders_sn"], "description": "Identifier type." }, "orders": { "type": "array", "description": "Orders Id values.", "items": { "type": "string", "description": "ID value." } } } },
    method: "get",
    pathTemplate: "/orders/auctionDetails",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "orders", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_client_put", {
    name: "orders_client_put",
    description: `orders/client
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "clientId": { "type": "number", "description": "Unique client's number." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/client",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_courier_put", {
    name: "orders_courier_put",
    description: `Method that enables changing the courier handling the shipment for an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "courierId": { "type": "number", "description": "Courier ID." }, "pickupPointId": { "type": "string", "description": "Collection point ID." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/courier",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_deliveryAddress_put", {
    name: "orders_deliveryAddress_put",
    description: `Method that enables editing the delivery address details for an order in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "clientDeliveryAddressId": { "type": "number", "description": "Delivery address ID." }, "clientLogin": { "type": "string", "description": "Customer's login." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/deliveryAddress",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_devide_put", {
    name: "orders_devide_put",
    description: `Method for division order
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "basketPosition": { "type": "number", "description": "Item in basket." }, "quantity": { "type": "number", "description": "Quantity", "format": "float" } } } }, "splitPayments": { "type": "boolean", "description": "Whether to split payments" } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/devide",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_documents_create_post", {
    name: "orders_documents_create_post",
    description: `The method allows to generate documents to the order in the IdoSell administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumbers": { "type": "array", "description": "", "items": { "type": "number" } }, "actualize": { "type": "boolean", "description": "" }, "documentType": { "type": "string", "description": "Document type", "enum": ["vat_invoice", "fiscal_invoice", "corrective_vat_invoice", "fiscal_receipt", "sales_confirmation"] }, "documentPurchaseDate": { "type": "string", "description": "Document purchase date" }, "printerId": { "type": "number", "description": "Printer id" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/documents/create",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_documents_delete_post", {
    name: "orders_documents_delete_post",
    description: `The method allows to delete documents added to the order in the IdoSell administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "documents": { "type": "array", "description": "List of documents.", "items": { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "id": { "type": "number", "description": "Document identifier." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/documents/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_documents_get", {
    name: "orders_documents_get",
    description: `Method that enables extracting information about documents issued for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "orderSerialNumber": { "type": "array", "description": "Order serial number.", "items": { "type": "string", "description": "Order serial number." } }, "documentType": { "type": "string", "description": "Document type", "enum": ["sales_confirmation", "vat_invoice", "corrective_vat_invoice", "advance_vat_invoice", "final_advance_vat_invoice", "pro_forma_invoice", "advance_pro_forma_invoice", "final_advance_pro_forma_invoice", "delivery_note", "fiscal_receipt", "fiscal_invoice", "other"] }, "returnElements": { "type": "array", "description": "Elements returned by api", "items": { "type": "string", "description": "element" } } }, "required": ["orderSerialNumber", "documentType"] },
    method: "get",
    pathTemplate: "/orders/documents",
    executionParameters: [{ "name": "orderSerialNumber", "in": "query" }, { "name": "documentType", "in": "query" }, { "name": "returnElements", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_documents_post", {
    name: "orders_documents_post",
    description: `The method allows to add TIFF, BMP, PNG, JPG, JPEG, GIF or PDF documents to the order in the IdoSell Shop administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "documents": { "type": "array", "description": "List of documents.", "items": { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "name": { "type": "string", "description": "File name." }, "pdfBase64": { "type": "string", "description": "BMP, PNG, JPG, JPEG, GIF or PDF files in Base64 encoding algorithm." }, "type": { "type": "string", "description": "Document type.", "enum": ["vat_invoice", "corrective_vat_invoice", "other"] }, "returnedInOrderDetails": { "type": "string", "description": "Is it to be shown to the customer in the order view.", "enum": ["y", "n"] }, "additionalData": { "type": "object", "description": "Additional information.", "properties": { "documentId": { "type": "string", "description": "Document number." }, "documentIssuedDate": { "type": "string", "description": "The date document was issued in the ISO 8601 format (YYYY-MM-DD)." } } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/documents",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_exportdocuments_EPP_get", {
    name: "orders_exportdocuments_EPP_get",
    description: `This method returns sales and warehouse documents in the universal EDI (Electronic Data Interchange) format.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "dateBegin": { "type": "string", "description": "Beginning date in YYYY-MM-DD HH:MM:SS format." }, "dateEnd": { "type": "string", "description": "Ending date in YYYY-MM-DD HH:MM:SS format." }, "applicationType": { "type": "string", "description": "", "enum": ["SubiektGT", "Rachmistrz", "wFirma"] }, "stocks": { "type": "array", "description": "Stock ID (required only when selecting particular stocks).", "items": { "type": "number" } }, "documentType": { "type": "string", "description": "Document type", "enum": ["all", "stocks", "invoice", "payments"] }, "invoiceFirstGeneratedDate": { "type": "number", "description": "Date the document was first generated." } }, "required": ["dateBegin", "dateEnd", "applicationType", "documentType"] },
    method: "get",
    pathTemplate: "/orders/exportdocuments/EPP",
    executionParameters: [{ "name": "dateBegin", "in": "query" }, { "name": "dateEnd", "in": "query" }, { "name": "applicationType", "in": "query" }, { "name": "stocks", "in": "query" }, { "name": "documentType", "in": "query" }, { "name": "invoiceFirstGeneratedDate", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_exportdocuments_JPK_get", {
    name: "orders_exportdocuments_JPK_get",
    description: `Method returns sales and warehouse documents in universal JPK format.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "documentType": { "type": "string", "description": "Document type", "enum": ["JPK_FA", "JPK_MAG", "JPK_VAT"] }, "fileId": { "type": "number", "description": "JPK file identifier to download." }, "documentVersion": { "type": "number", "description": "JPK format version. If empty, takes the latest version number." }, "schemaVersion": { "type": "string", "description": "Schema version" }, "dateBegin": { "type": "string", "description": "Beginning date in YYYY-MM-DD HH:MM:SS format. (JPK_FA, JPK_MAG)" }, "dateEnd": { "type": "string", "description": "Ending date in YYYY-MM-DD HH:MM:SS format. (JPK_FA, JPK_MAG)" }, "month": { "type": "number", "description": "Billing month for which to generate the document. (JPK_VAT)" }, "year": { "type": "number", "description": "Billing year for which to generate the document. (JPK_VAT)" }, "currency": { "type": "string", "description": "Currency symbol in ISO 4217 format." }, "shop": { "type": "array", "description": "Store ID only required if a specific store is selected.", "items": { "type": "number" } }, "stockId": { "type": "array", "description": "Stock ID", "items": { "type": "number" } }, "forceBackgroundGenerate": { "type": "boolean", "description": "Forces the file to be generated by background tasks. The file will be generated later. Then, after it is generated, you will be able to download the given file using the returned ID. The file will be available 24h after the task is completed." } } },
    method: "get",
    pathTemplate: "/orders/exportdocuments/JPK",
    executionParameters: [{ "name": "documentType", "in": "query" }, { "name": "fileId", "in": "query" }, { "name": "documentVersion", "in": "query" }, { "name": "schemaVersion", "in": "query" }, { "name": "dateBegin", "in": "query" }, { "name": "dateEnd", "in": "query" }, { "name": "month", "in": "query" }, { "name": "year", "in": "query" }, { "name": "currency", "in": "query" }, { "name": "shop", "in": "query" }, { "name": "stockId", "in": "query" }, { "name": "forceBackgroundGenerate", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_handler_get", {
    name: "orders_handler_get",
    description: `Method that enables getting information about the handler currently assigned to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." } }, "required": ["orderSerialNumber"] },
    method: "get",
    pathTemplate: "/orders/handler",
    executionParameters: [{ "name": "orderSerialNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_handler_put", {
    name: "orders_handler_put",
    description: `Method that enabled assigning a handler to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "orderOperatorLogin": { "type": "string", "description": "Order handler." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/handler",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_history_get", {
    name: "orders_history_get",
    description: `Method allows to retrieve orders history from the IdoSell Shop panel
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." } }, "required": ["orderSerialNumber"] },
    method: "get",
    pathTemplate: "/orders/history",
    executionParameters: [{ "name": "orderSerialNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_images_delete_post", {
    name: "orders_images_delete_post",
    description: `Method allows to remove image attachments from the details of the specified order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "order": { "type": "object", "description": "", "properties": { "orderId": { "type": "string", "description": "Order ID" }, "orderSerialNumber": { "type": "number", "description": "Order serial number" } } }, "images": { "type": "array", "description": "List of attachment IDs to be removed from the details of the selected order", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Attachment ID" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/images/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_images_get", {
    name: "orders_images_get",
    description: `Method allows downloading image attachment data from the details of the specified order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "imageId": { "type": "number", "description": "Attachment ID (Photos)" }, "orderSerialNumber": { "type": "number", "description": "Order serial number" } }, "required": ["imageId"] },
    method: "get",
    pathTemplate: "/orders/images",
    executionParameters: [{ "name": "imageId", "in": "query" }, { "name": "orderSerialNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_images_post", {
    name: "orders_images_post",
    description: `Method allows to add image attachments to the details of the specified order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Gate call parameters", "properties": { "userName": { "type": "string", "description": "Login" }, "settings": { "type": "object", "description": "", "properties": { "sourceType": { "type": "string", "description": "Source type. Available values: base64 - Attachment data encoded using the base64 algorithm, url - Attachment file link", "enum": ["base64", "url"] } } }, "order": { "type": "object", "description": "", "properties": { "orderId": { "type": "string", "description": "Order ID" }, "orderSerialNumber": { "type": "number", "description": "Order serial number" } } }, "images": { "type": "array", "description": "List of image attachments", "items": { "type": "object", "properties": { "type": { "type": "string", "description": "Type. Available values: product - Product photo, package - Package photo", "enum": ["product", "package"] }, "source": { "type": "string", "description": "Attachment source data, depending on the source type selected in the settings. BMP, PNG, JPG, JPEG, GIF or PDF files in Base64 encoding algorithm." }, "name": { "type": "string", "description": "Name" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/images",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_labels_get", {
    name: "orders_labels_get",
    description: `The method is used to generate parcels and printouts for a courier.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." } }, "required": ["orderSerialNumber"] },
    method: "get",
    pathTemplate: "/orders/labels",
    executionParameters: [{ "name": "orderSerialNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_opinions_search_post", {
    name: "orders_opinions_search_post",
    description: `The method allows for downloading information about reviews issued for orders available in the IdoSell Shop administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "opinion": { "type": "object", "description": "Review identification", "properties": { "id": { "type": "number", "description": "" }, "language": { "type": "string", "description": "Customer language ID." }, "confirmed": { "type": "boolean", "description": "" }, "host": { "type": "string", "description": "" }, "shopId": { "type": "number", "description": "Shop Id" } } }, "orders": { "type": "object", "description": "Orders.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "serialNumber"] }, "value": { "type": "string", "description": "" } } }, "clients": { "type": "object", "description": "Customer data.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "login", "codeExtern"] }, "value": { "type": "string", "description": "" } } }, "dateRange": { "type": "object", "description": "Date range", "properties": { "begin": { "type": "string", "description": "" }, "end": { "type": "string", "description": "" } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "ordersBy": { "type": "array", "description": "Possibility of sorting returned list", "items": { "type": "object", "properties": { "elementName": { "type": "string", "description": "Field name by which a list will be sorted.\n                Available values:\n                \"date\" - Date of adding an opinion,\n                \"rating\" - Rating attached to opinion,\n                \"scorePositive\" - Usefulness of the opinion - number of positive ratings,\n                \"scoreNegative\" - Usefulness of the opinion - number of negative ratings,\n                \"modificationDatetime\" - Last modification date" }, "sortDirection": { "type": "string", "description": "Determines sorting direction.\n                Available values:\n                \"ASC\" - ascending,\n                \"DESC\" - descending." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/opinions/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_opinionsRate_get", {
    name: "orders_opinionsRate_get",
    description: `Evaluation of the usefulness of opinions issued for orders.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "number", "description": "" }, "operation": { "type": "string", "description": "", "enum": ["positive", "negative"] } }, "required": ["id", "operation"] },
    method: "get",
    pathTemplate: "/orders/opinionsRate",
    executionParameters: [{ "name": "id", "in": "query" }, { "name": "operation", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_orders_get", {
    name: "orders_orders_get",
    description: `Method that enables extracting information about orders present in the IdoSell Shop administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "ordersIds": { "type": "array", "description": "Orders IDs.", "items": { "type": "string" } }, "ordersSerialNumbers": { "type": "array", "description": "Order serial numbers. You can transfer a maximum of 100 items.", "items": { "type": "number" } }, "orderExternalId": { "type": "string", "description": "The order ID of the external service. You can transfer a maximum of 100 items in one request." } } },
    method: "get",
    pathTemplate: "/orders/orders",
    executionParameters: [{ "name": "ordersIds", "in": "query" }, { "name": "ordersSerialNumbers", "in": "query" }, { "name": "orderExternalId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_orders_put", {
    name: "orders_orders_put",
    description: `Method that enables editing an order in the administration panel. It allows, for example, to change the products included in the order or change its status.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orders": { "type": "array", "description": "Orders.", "items": { "type": "object", "properties": { "orderId": { "type": "string", "description": "Order ID." }, "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "orderStatus": { "type": "string", "description": "Order status.\n            Allowed values:\n            \"finished_ext\" - order status: completed in FA application,\n            \"finished\" - completed,\n            \"new\" - not handled,\n            \"payment_waiting\" - awaiting payment,\n            \"delivery_waiting\" - awaiting delivery,\n            \"on_order\" - in progress,\n            \"packed\" - being picked,\n            \"packed_fulfillment\" - being picked - fulfilment,\n            \"packed_ready\" - packed,\n            \"ready\" - ready,\n            \"wait_for_dispatch\" - awaiting dispatch date,\n            \"suspended\" - on hold,\n            \"joined\" - merged,\n            \"missing\" - missing,\n            \"lost\" - lost,\n            \"false\" - false,\n            \"canceled\" - Customer canceled." }, "orderStatusId": { "type": "number", "description": "Order status id ." }, "transactionType": { "type": "string", "description": "Transaction type.", "enum": ["national", "oss", "export", "intra"] }, "apiFlag": { "type": "string", "description": "Flag informing on order registration or completion in external program through API.\n            Allowed values.\n            \"none\" - order was not registered in external program,\n            \"registered\" - order was registered in external program,\n            \"realized\" - order was completed in external program,\n            \"registered_pos\" - order was registered in external program,\n            \"realized_pos\" - order was completed in external program.", "enum": ["none", "registered", "realized", "registered_pos", "realized_pos", "registration_fault"] }, "apiNoteToOrder": { "type": "string", "description": "API note added to order." }, "clientNoteToOrder": { "type": "string", "description": "Customer comments on order." }, "clientNoteToCourier": { "type": "string", "description": "Customer remarks for courier." }, "orderNote": { "type": "string", "description": "Note to the order." }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "sizeId": { "type": "string", "description": "Size identifier" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "basketPosition": { "type": "number", "description": "Item in basket." }, "stockId": { "type": "number", "description": "Stock ID" }, "productFree": { "type": "boolean", "description": "Free product." }, "forceLoyaltyPoints": { "type": "number", "description": "", "format": "float" }, "productQuantity": { "type": "number", "description": "Product quantity.", "format": "float" }, "productQuantityOperationType": { "type": "string", "description": "Type of operation performed on product linked to current order.\n            Allowed values:\n            \"add\" - adds the product to current order in appropriate amount,\n            \"subtract\" - removes the product from current order in appropriate amount.", "enum": ["add", "substract"] }, "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productVat": { "type": "number", "description": "Value of VAT", "format": "float" }, "productVatFree": { "type": "string", "description": "Is product VAT free\n            Allowed values\n            \"y\" - yes,\n            \"n\" - no." }, "remarksToProduct": { "type": "string", "description": "Client's remarks on product." }, "label": { "type": "string", "description": "Label for grouping products." }, "productBundleItems": { "type": "array", "description": "List of components if a products is a set or collection.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" }, "productIndex": { "type": "string", "description": "One of the unique, indexed product codes (IAI code / External system code / Producer code)" } } } }, "priceFormulaParameters": { "type": "array", "description": "Information about the selected parameters in the configurator.", "items": { "type": "object", "properties": { "parameterId": { "type": "string", "description": "Parameter ID" }, "parameterValue": { "type": "string", "description": "" }, "parameterValues": { "type": "array", "description": "Parameter values", "items": { "type": "object", "properties": { "valueId": { "type": "string", "description": "" } } } } } } } } } }, "orderPaymentType": { "type": "string", "description": "Order payment method.\n            Allowed values.\n            \"cash_on_delivery\" - cash on delivery,\n            \"prepaid\" - prepayment,\n            \"tradecredit\" - Trade credit.", "enum": ["cash_on_delivery", "prepaid", "tradecredit"] }, "orderSettledAtPrice": { "type": "string", "description": "Settlement by prices.\n            \"gross\" - gross,\n            \"net\" - net,\n            \"net_without_VAT\" - net without VAT.", "enum": ["gross", "net", "net_without_VAT"] }, "ignoreBridge": { "type": "boolean", "description": "Omits collecting orders via IAI Bridge." }, "settings": { "type": "object", "description": "Settings", "properties": { "dontSendMail": { "type": "string", "description": "Blocks the sending of emails", "enum": ["y", "n"] }, "dontSendSMS": { "type": "string", "description": "Blocks the sending of sms messages", "enum": ["y", "n"] } } }, "emailProcessingConsent": { "type": "string", "description": "Consent to send data to cooperating services", "enum": ["yes", "no", "disabled"] }, "clientRequestInvoice": { "type": "string", "description": "Customer asked for invoice.\n            List of parameters:\n            \"y\" - yes (paper invoicing ),\n            \"e\" - yes (electronic invoicing ),\n            \"n\" - no." }, "billingCurrency": { "type": "string", "description": "Order settlement currency." }, "billingCurrencyRate": { "type": "number", "description": "Panel billing currency exchange rate in relation to billing currency in the shop .", "format": "float" }, "purchaseDate": { "type": "string", "description": "Sale date.\n            ISO 8602 format." }, "estimatedDeliveryDate": { "type": "string", "description": "Estimated date of shipment of the order in format Y-m-d H:i" }, "splitPayment": { "type": "boolean", "description": "Split payment MPP marking" }, "plannedDateOfPacking": { "type": "string", "description": "Planned date of packing" }, "stockId": { "type": "number", "description": "Order stock ID (stock handling the order). 0 - dropshipping (external stock), value greater than 0 - own stock." }, "delivererId": { "type": "number", "description": "Deliverer ID. Used (and required) only when stockId = 0 (dropshipping)." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/orders",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_orders_post", {
    name: "orders_orders_post",
    description: `Method that is used for adding new retail or wholesale orders to a shop in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orders": { "type": "array", "description": "Orders.", "items": { "type": "object", "properties": { "orderType": { "type": "string", "description": "Order type.\n            Allowed values.\n            \"retail\" - retail order,\n            \"wholesale\" - wholesale order (can be added only by customer with wholesale account registered).\n            Default value:: \"retail\"" }, "shopId": { "type": "number", "description": "Shop Id" }, "stockId": { "type": "number", "description": "Stock ID" }, "orderPaymentType": { "type": "string", "description": "Order payment method.\n            Allowed values.\n            \"cash_on_delivery\" - cash on delivery,\n            \"prepaid\" - prepayment,\n            \"tradecredit\" - Trade credit.", "enum": ["cash_on_delivery", "prepaid", "tradecredit"] }, "currencyId": { "type": "string", "description": "Currency ID" }, "clientWithoutAccount": { "type": "string", "description": "Determines if customer unregistered.\n            Allowed values.\n            \"y\" - casual client,\n            \"n\" - registered customer.\n            Default value:: \"y\".\n            If customer is unregistered, enter customer details in element: \"clientWithoutAccountData\".\n            For client with account - existing login should be stored in: \"clientLogin\"." }, "clientWithoutAccountData": { "type": "object", "description": "Balance data for casual client. Object is necessary for casual clients (in case of client_once has y value).", "properties": { "clientFirstName": { "type": "string", "description": "Customer's first name." }, "clientLastName": { "type": "string", "description": "Customer's last name." }, "clientFirm": { "type": "string", "description": "Customer's company name." }, "clientNip": { "type": "string", "description": "Customer Tax no." }, "clientStreet": { "type": "string", "description": "Street and number." }, "clientZipCode": { "type": "string", "description": "Customer's postal code." }, "clientCity": { "type": "string", "description": "Customer's city." }, "clientCountry": { "type": "string", "description": "Customer's country." }, "clientEmail": { "type": "string", "description": "E-mail address." }, "clientPhone1": { "type": "string", "description": "Cell phone." }, "clientPhone2": { "type": "string", "description": "Land line." }, "langId": { "type": "string", "description": "Language ID" } } }, "clientLogin": { "type": "string", "description": "Customer's login." }, "clientNoteToOrder": { "type": "string", "description": "Customer comments on order." }, "clientNoteToCourier": { "type": "string", "description": "Customer remarks for courier." }, "affiliateId": { "type": "number", "description": "ID of a partner who acquired a given customer." }, "courierId": { "type": "number", "description": "Courier ID." }, "pickupPointId": { "type": "string", "description": "Collection point ID." }, "deliveryCost": { "type": "number", "description": "Delivery cost.", "format": "float" }, "clientDeliveryAddress": { "type": "object", "description": "Delivery address data.", "properties": { "clientDeliveryAddressFirstName": { "type": "string", "description": "Recipient's first name." }, "clientDeliveryAddressLastName": { "type": "string", "description": "Recipient's last name." }, "clientDeliveryAddressAdditional": { "type": "string", "description": "Additional information." }, "clientDeliveryAddressStreet": { "type": "string", "description": "Recipient street and number." }, "clientDeliveryAddressZipCode": { "type": "string", "description": "Recipient's postal code." }, "clientDeliveryAddressCity": { "type": "string", "description": "Recipient's city." }, "clientDeliveryAddressCountry": { "type": "string", "description": "Recipient's country." }, "clientDeliveryAddressPhone": { "type": "string", "description": "Consignee's phone number." } } }, "payerAddress": { "type": "object", "description": "Buyer's address data.", "properties": { "payerAddressId": { "type": "number", "description": "Buyer's address id." }, "payerAddressFirstName": { "type": "string", "description": "Buyer's first name." }, "payerAddressLastName": { "type": "string", "description": "Buyer's last name." }, "payerAddressFirm": { "type": "string", "description": "Company name." }, "payerAddressNip": { "type": "string", "description": "Customer VAT ID." }, "payerAddressStreet": { "type": "string", "description": "Buyer's street name and house number." }, "payerAddressZipCode": { "type": "string", "description": "Buyer's postal code." }, "payerAddressCity": { "type": "string", "description": "Buyer's city." }, "payerAddressCountryId": { "type": "string", "description": "Country code in the ISO 3166-1 A2 standard." }, "payerAddressPhone": { "type": "string", "description": "Buyer's telephone number." } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "sizeId": { "type": "string", "description": "Size identifier" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "stockId": { "type": "number", "description": "Stock ID" }, "productQuantity": { "type": "number", "description": "Product quantity.", "format": "float" }, "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productFree": { "type": "boolean", "description": "Free product." }, "forceLoyaltyPoints": { "type": "number", "description": "", "format": "float" }, "productVat": { "type": "number", "description": "Value of VAT", "format": "float" }, "productVatFree": { "type": "string", "description": "Is product VAT free\n            Allowed values\n            \"y\" - yes,\n            \"n\" - no." }, "discountCode": { "type": "object", "description": "Information on used discount code.", "properties": { "name": { "type": "string", "description": "Name." } } }, "remarksToProduct": { "type": "string", "description": "Client's remarks on product." }, "label": { "type": "string", "description": "Label for grouping products." }, "productBundleItems": { "type": "array", "description": "List of components if a products is a set or collection.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" }, "productIndex": { "type": "string", "description": "One of the unique, indexed product codes (IAI code / External system code / Producer code)" } } } } } } }, "orderRebateValue": { "type": "number", "description": "Discount value.", "format": "float" }, "orderOperatorLogin": { "type": "string", "description": "Order handler." }, "ignoreBridge": { "type": "boolean", "description": "Omits collecting orders via IAI Bridge." }, "settings": { "type": "object", "description": "Settings", "properties": { "settingSendMail": { "type": "boolean", "description": "Send an email with order placement confirmation." }, "settingSendSMS": { "type": "boolean", "description": "Send a text message with order placement confirmation." } } }, "orderSettledAtPrice": { "type": "string", "description": "Settlement by prices.\n            \"gross\" - gross,\n            \"net\" - net,\n            \"net_without_VAT\" - net without VAT.", "enum": ["gross", "net", "net_without_VAT"] }, "clientRequestInvoice": { "type": "string", "description": "Customer asked for invoice.\n            List of parameters:\n            \"y\" - yes (paper invoicing ),\n            \"e\" - yes (electronic invoicing ),\n            \"n\" - no." }, "billingCurrency": { "type": "string", "description": "Order settlement currency." }, "billingCurrencyRate": { "type": "number", "description": "Panel billing currency exchange rate in relation to billing currency in the shop .", "format": "float" }, "purchaseDate": { "type": "string", "description": "Sale date.\n            ISO 8602 format." }, "splitPayment": { "type": "boolean", "description": "Split payment MPP marking" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/orders",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_orders_search_post", {
    name: "orders_orders_search_post",
    description: `Method that enables extracting information about orders present in the IdoSell Shop administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderPrepaidStatus": { "type": "string", "description": "Prepayment status.\n            Status list:\n            \"unpaid\" - not paid,\n            \"restored\" - returned,\n            \"waiting\" - not registered." }, "ordersStatuses": { "type": "array", "description": "Order status.\n            Status list:\n            \"new\" - not handled,\n            \"finished\" - completed,\n            \"false\" - false,\n            \"lost\" - lost,\n            \"on_order\" - in progress,\n            \"packed\" - being picked,\n            \"ready\" - ready,\n            \"canceled\" - canceled by customer,\n            \"payment_waiting\" - awaiting payment,\n            \"delivery_waiting\" - awaiting delivery,\n            \"suspended\" - on hold,\n            \"joined\" - merged,\n            \"finished_ext\" - handled in FA application.", "items": { "type": "string" } }, "ordersStatusesIds": { "type": "array", "description": "Order statusses ids.", "items": { "type": "number" } }, "transactionType": { "type": "string", "description": "Transaction type.", "enum": ["national", "oss", "export", "intra"] }, "shippmentStatus": { "type": "string", "description": "", "enum": ["all", "received", "non-received"] }, "couriersName": { "type": "array", "description": "Shipping companies (packages deliverers).", "items": { "type": "string" } }, "couriersId": { "type": "array", "description": "Courier service identifiers", "items": { "type": "number" } }, "orderPaymentType": { "type": "string", "description": "Order payment method.\n            Allowed values.\n            \"cash_on_delivery\" - cash on delivery,\n            \"prepaid\" - prepayment,\n            \"tradecredit\" - Trade credit." }, "withMissingSalesDocuments": { "type": "array", "description": "", "items": { "type": "string" } }, "orderType": { "type": "string", "description": "Order type.\n            Allowed values.\n            \"retail\" - retail order,\n            \"wholesale\" - wholesale order (can be added only by customer with wholesale account registered).\n            Default value:: \"retail\"", "enum": ["wholesale", "retail", "dropshipping", "deliverer"] }, "dropshippingOrderStatus": { "type": "string", "description": "", "enum": ["all", "finished", "canceled", "notCanceled"] }, "ordersIds": { "type": "array", "description": "Orders IDs.", "items": { "type": "string" } }, "ordersSerialNumbers": { "type": "array", "description": "Order serial numbers.", "items": { "type": "number" } }, "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "clientLogin": { "type": "string", "description": "Customer's login." }, "clientId": { "type": "number", "description": "Unique client's number." }, "clientFirstName": { "type": "string", "description": "Customer's first name." }, "clientLastName": { "type": "string", "description": "Customer's last name." }, "clientCity": { "type": "string", "description": "Customer's city." }, "clientEmail": { "type": "string", "description": "E-mail address." }, "clientHasTaxNumber": { "type": "string", "description": "Parameter can be used to search for orders assigned to customer with VAT number.\n            Available values:\n            \"y\" - customer has VAT number,\n            \"n\" - customer does not have VAT number." }, "clientSearchingMode": { "type": "string", "description": "Parameter allows to choose, by which data orders should be searched. Includes city, firstname, lastname.\n            Available values:\n            \"billing_data\" - search by billing data - default,\n            \"delivery_data\"- search by delivery data,\n            \"billing_delivery_data\" - search by billing and delivery data." }, "clientFirm": { "type": "string", "description": "Customer's company name." }, "clientNip": { "type": "string", "description": "Customer Tax no." }, "clientCountryId": { "type": "string", "description": "Country ID in accordance with ISO-3166." }, "clientCountryName": { "type": "string", "description": "Region name takes priority over clientCountryId." } } } }, "ordersRange": { "type": "object", "description": "Ranges of dates or serial numbers.", "properties": { "ordersDateRange": { "type": "object", "description": "Data for date range", "properties": { "ordersDateType": { "type": "string", "description": "Type of date according to the orders are searched.\n            Type of date listing:\n            \"add\" - date of order was placed,\n            \"modified\" - date of order modification,\n            \"dispatch\" - date or order dispatch,\n            \"payment\" - date of order payment,\n            \"last_payments_operation\" - date of last payment operation,\n            \"declared_payments\" - date of last payment.", "enum": ["add", "modified", "dispatch", "payment", "last_payments_operation", "declared_payments"] }, "ordersDatesTypes": { "type": "array", "description": "Date chart according to which orders are searched.\n            Type of date listing:\n            \"add\" - date of order was placed,\n            \"modified\" - date of order modification,\n            \"dispatch\" - date or order dispatch,\n            \"payment\" - date of order payment.\n            \"last_payments_operation\" - date of last payment operation,\n            \"declared_payments\" - date of last payment.", "items": { "type": "object", "properties": { "ordersDatesType": { "type": "string", "description": "", "enum": ["add", "modified", "dispatch", "payment", "last_payments_operation", "declared_payments"] } } } }, "ordersDateBegin": { "type": "string", "description": "Beginning date in YYYY-MM-DD HH:MM:SS format." }, "ordersDateEnd": { "type": "string", "description": "Ending date in YYYY-MM-DD HH:MM:SS format." } } }, "ordersSerialNumberRange": { "type": "object", "description": "Data for serial number range.", "properties": { "ordersSerialNumberBegin": { "type": "number", "description": "Starting number of serial numbers range for sought products." }, "ordersSerialNumberEnd": { "type": "number", "description": "Ending number for serial number range." } } } } }, "orderSource": { "type": "object", "description": "Order source data.", "properties": { "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } }, "auctionsParams": { "type": "object", "description": "Object used for order searching based on auctions' parameters.", "properties": { "auctionsServicesNames": { "type": "array", "description": "Auction sites names.\n            Auction sites listing:\n            \"allegro\" - Allegro.pl,\n            \"testwebapi\" - Allegro.pl test site,\n            \"ebay\" - eBay.", "items": { "type": "string" } }, "auctionsItemsIds": { "type": "array", "description": "Auctions' numbers.", "items": { "type": "number" } }, "auctionsAccounts": { "type": "array", "description": "Auction sites accounts' data.", "items": { "type": "object", "properties": { "auctionsAccountId": { "type": "number", "description": "Auction service account Id ." }, "auctionsAccountLogin": { "type": "string", "description": "External marketplace service account name (which the listing was created from)." } } } }, "auctionsClients": { "type": "array", "description": "Client's account on auction site data.", "items": { "type": "object", "properties": { "auctionClientId": { "type": "string", "description": "Account ID on auction site." }, "auctionClientLogin": { "type": "string", "description": "Account login on auction site." } } } } } } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productName": { "type": "string", "description": "Product name." }, "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" } } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "clientRequestInvoice": { "type": "string", "description": "Customer asked for invoice.\n            List of parameters:\n            \"y\" - yes (paper invoicing ),\n            \"e\" - yes (electronic invoicing ),\n            \"n\" - no." }, "packages": { "type": "object", "description": "Information on consignments.", "properties": { "packagesNumbers": { "type": "array", "description": "Consignments numbers.", "items": { "type": "string" } }, "orderHasPackageNumbers": { "type": "string", "description": "Does order have consignment number assigned.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "hasMultiPackages": { "type": "string", "description": "Multipack order.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no.", "enum": ["y", "n"] } } }, "stocks": { "type": "array", "description": "Stock quantities data.", "items": { "type": "object", "properties": { "stockId": { "type": "number", "description": "Stock ID" } } } }, "campaign": { "type": "object", "description": "Used discount codes data.", "properties": { "campaignId": { "type": "number", "description": "Campaign ID." }, "discountCodes": { "type": "array", "description": "Discount codes.", "items": { "type": "string" } } } }, "loyaltyPointsMode": { "type": "string", "description": "Loyalty points.", "enum": ["all", "given", "taken", "given_or_taken", "given_and_taken", "not_given_nor_taken"] }, "orderOperatorLogin": { "type": "string", "description": "Order handler." }, "orderPackingPersonLogin": { "type": "string", "description": "Order picker." }, "ordersBy": { "type": "array", "description": "Possibility of sorting returned list", "items": { "type": "object", "properties": { "elementName": { "type": "string", "description": "Name of field, list will be sorted by.\n            Available values:\n            \"id\" - Order ID,\n            \"sn\" - Order ID,\n            \"order_time\" - Order placement time,\n            \"status\" - Status order: t - finished , n - new, w - payment_waiting, d - delivery_waiting, o - on_order, b - packed, br - packed_ready, bf - packed_fulfillment, p - ready, wd - wait_for_dispatch, k - canceled, i - false, s - lost, z - returned, r - complainted, h - suspended, j - joined, l - missing, a - finished_ext, u - unconfirmed,\n            \"order_source\" - Order source,\n            \"order_cost\" - order cost calculated as a sum of: base order worth, delivery cost, payform cost, insurance cost,\n            \"discount_code\" - order discount code,\n            \"ready_to_send_date\" - orders with status p - ready first,\n            \"order_value\" - order value calculated as a sum of: base order worth, delivery cost, payform cost, insurance cost" }, "sortDirection": { "type": "string", "description": "Determines sorting direction.\n            Available values:\n            \"ASC\" - ascending,\n            \"DESC\" - descending." } } } }, "searchingOperatorTypeMatch": { "type": "string", "description": "Method of searching orders by handler.", "enum": ["no_assignment", "no_empty", "empty"] }, "ordersDelayed": { "type": "string", "description": "Orders with the exceeded date of shipment.", "enum": ["y", "n"] }, "showBundles": { "type": "boolean", "description": "Combine the components of the set into one item" }, "orderExternalId": { "type": "string", "description": "The order ID of the external service" }, "orderCurrency": { "type": "string", "description": "Order currency" }, "subscription": { "type": "number", "description": "Subscription id" }, "subscriptionIds": { "type": "array", "description": "Subscription ids", "items": { "type": "number" } }, "subscriptionsOrders": { "type": "string", "description": "Orders from subscriptions", "enum": ["y", "n"] } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/orders/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_packages_get", {
    name: "orders_packages_get",
    description: `Method that enables getting a list of parcels assigned to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "deliveryPackageNumbers": { "type": "array", "description": "Consignments numbers.", "items": { "type": "string" } }, "orderNumbers": { "type": "array", "description": "Order serial numbers.", "items": { "type": "number" } }, "returnNumbers": { "type": "array", "description": "Returns numbers.", "items": { "type": "number" } }, "rmaNumbers": { "type": "array", "description": "RMA numbers.", "items": { "type": "number" } }, "returnLabels": { "type": "boolean", "description": "Return parcel labels." } } },
    method: "get",
    pathTemplate: "/orders/packages",
    executionParameters: [{ "name": "deliveryPackageNumbers", "in": "query" }, { "name": "orderNumbers", "in": "query" }, { "name": "returnNumbers", "in": "query" }, { "name": "rmaNumbers", "in": "query" }, { "name": "returnLabels", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_packages_put", {
    name: "orders_packages_put",
    description: `Method that enables editing parcels already assigned to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderPackages": { "type": "array", "description": "List of parcels assigned to the order Maximum default number: 100 parcels.", "items": { "type": "object", "properties": { "eventId": { "type": "string", "description": "Id." }, "eventType": { "type": "string", "description": "Type.", "enum": ["order", "rma", "return"] }, "packages": { "type": "array", "description": "Information on consignments.", "items": { "type": "object", "properties": { "deliveryPackageId": { "type": "number", "description": "Shipment ID." }, "courierId": { "type": "string", "description": "Courier ID." }, "deliveryPackageNumber": { "type": "string", "description": "Package number." }, "deliveryShippingNumber": { "type": "string", "description": "consignment number." }, "deliveryPackageParameters": { "type": "object", "description": "Package parameters.", "properties": { "productWeight": { "type": "number", "description": "Product weight (g)." }, "packagingWeight": { "type": "number", "description": "Packaging weight (g)." } } }, "shippingStoreCosts": { "type": "object", "description": "Cost for shop.", "properties": { "amount": { "type": "number", "description": "Value.", "format": "float" }, "tax": { "type": "number", "description": "Value Added Tax." } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/packages",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_packages_post", {
    name: "orders_packages_post",
    description: `Method that enables editing parcels already assigned to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderPackages": { "type": "array", "description": "List of parcels assigned to the order Maximum default number: 100 parcels.", "items": { "type": "object", "properties": { "eventId": { "type": "string", "description": "Id." }, "eventType": { "type": "string", "description": "Type.", "enum": ["order", "rma", "return"] }, "packages": { "type": "array", "description": "Information on consignments.", "items": { "type": "object", "properties": { "deliveryPackageId": { "type": "number", "description": "Shipment ID." }, "courierId": { "type": "string", "description": "Courier ID." }, "deliveryPackageNumber": { "type": "string", "description": "Package number." }, "deliveryShippingNumber": { "type": "string", "description": "consignment number." }, "deliveryPackageParameters": { "type": "object", "description": "Package parameters.", "properties": { "productWeight": { "type": "number", "description": "Product weight (g)." }, "packagingWeight": { "type": "number", "description": "Packaging weight (g)." } } }, "shippingStoreCosts": { "type": "object", "description": "Cost for shop.", "properties": { "amount": { "type": "number", "description": "Value.", "format": "float" }, "tax": { "type": "number", "description": "Value Added Tax.", "format": "float" } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/packages",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_pickupPoint_put", {
    name: "orders_pickupPoint_put",
    description: `The method allows to change the collection point in the order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "pickupPointId": { "type": "string", "description": "Collection point ID." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/pickupPoint",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_printerDocuments_get", {
    name: "orders_printerDocuments_get",
    description: `Method that enables getting a VAT invoice issued for an order added to the administration panel by the IAI POS application.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "user": { "type": "string", "description": "" }, "printScenarioAction": { "type": "string", "description": "" }, "objectNumber": { "type": "string", "description": "" }, "objectType": { "type": "string", "description": "" }, "printerAccessKey": { "type": "string", "description": "" }, "skipNotGeneratedDocument": { "type": "boolean", "description": "" } }, "required": ["user", "printScenarioAction", "objectNumber", "objectType", "printerAccessKey"] },
    method: "get",
    pathTemplate: "/orders/printerDocuments",
    executionParameters: [{ "name": "user", "in": "query" }, { "name": "printScenarioAction", "in": "query" }, { "name": "objectNumber", "in": "query" }, { "name": "objectType", "in": "query" }, { "name": "printerAccessKey", "in": "query" }, { "name": "skipNotGeneratedDocument", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_productsSerialNumbers_put", {
    name: "orders_productsSerialNumbers_put",
    description: `Method that enables adding serial numbers to products in an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orders": { "type": "array", "description": "Orders.", "items": { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "orderProducts": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "sizeId": { "type": "string", "description": "Size identifier" }, "productSerialNumbers": { "type": "array", "description": "Serial numbers.", "items": { "type": "string" } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/productsSerialNumbers",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_profitMargin_put", {
    name: "orders_profitMargin_put",
    description: `Method that enables setting price margins for products in an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "orders": { "type": "array", "description": "Orders.", "items": { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "", "properties": { "identValue": { "type": "string", "description": "ID value." }, "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern"] } } }, "sizeId": { "type": "string", "description": "Size identifier" }, "productProfitMargin": { "type": "number", "description": "Product profit margin gross.", "format": "float" }, "productProfitMarginNet": { "type": "number", "description": "Product profit margin net.", "format": "float" }, "errors": { "type": "object", "description": "Information on error that occurred during gate call.", "properties": { "faultCode": { "type": "number", "description": "Error code." }, "faultString": { "type": "string", "description": "Error description." } } } } } }, "errors": { "type": "object", "description": "Information on error that occurred during gate call.", "properties": { "faultCode": { "type": "number", "description": "Error code." }, "faultString": { "type": "string", "description": "Error description." } } }, "isProductsErrors": { "type": "boolean", "description": "Flag marking errors in the result." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/profitMargin",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_profitability_get", {
    name: "orders_profitability_get",
    description: `The method is used to retrieve information about the profitability of an order
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." } }, "required": ["orderSerialNumber"] },
    method: "get",
    pathTemplate: "/orders/profitability",
    executionParameters: [{ "name": "orderSerialNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_shippingCosts_put", {
    name: "orders_shippingCosts_put",
    description: `Method that enables editing the delivery costs for an order in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "deliveryCost": { "type": "number", "description": "Delivery cost.", "format": "float" }, "orderDeliveryVat": { "type": "number", "description": "Delivery VAT.", "format": "float" } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/shippingCosts",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_statuses_get", {
    name: "orders_statuses_get",
    description: `Allows to download all configurable order statuses
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/orders/statuses",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_unfinished_search_post", {
    name: "orders_unfinished_search_post",
    description: `It allows you to download information about unclosed orders located in the store's administration panel. Orders with a status of false and lost are considered closed. Orders with a status of false and lost are considered closed.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderPrepaidStatus": { "type": "string", "description": "Prepayment status.\n            Status list:\n            \"unpaid\" - not paid,\n            \"restored\" - returned,\n            \"waiting\" - not registered." }, "ordersStatuses": { "type": "array", "description": "Order status.\n                Status list:\n                \"new\" - not handled,\n                \"on_order\" - in progress,\n                \"packed\" - being picked,\n                \"packed_fulfillment\" - being picked - fulfilment,\n                \"packed_ready\" - packed,\n                \"ready\" - ready,\n                \"payment_waiting\" - awaiting payment,\n                \"delivery_waiting\" - awaiting delivery,\n                \"wait_for_dispatch\" - awaiting dispatch date,\n                \"suspended\" - on hold,\n                \"finished_ext\" - handled in FA application.", "items": { "type": "string" } }, "ordersStatusesIds": { "type": "array", "description": "Order statuses ids.", "items": { "type": "number" } }, "couriersName": { "type": "array", "description": "Shipping companies (packages deliverers).", "items": { "type": "string" } }, "orderPaymentType": { "type": "string", "description": "Order payment method.\n            Allowed values.\n            \"cash_on_delivery\" - cash on delivery,\n            \"prepaid\" - prepayment,\n            \"tradecredit\" - Trade credit." }, "orderType": { "type": "string", "description": "Order type.\n                Allowed values:\n                \"retail\" - retail order,\n                \"wholesale\" - whiolesale order ,\n                \"dropshipping\" - order to be handled,\n                \"deliverer\" - order sent to the supplier.", "enum": ["wholesale", "retail", "dropshipping", "deliverer"] }, "dropshippingOrderStatus": { "type": "string", "description": "Dropshipping order status in the supplier's system.\n                Allowed values:\n                \"all\" - all,\n                \"finished\" - sent,\n                \"canceled\" - canceled,\n                \"notCanceled\" - failed to cancel.", "enum": ["all", "finished", "canceled", "notCanceled"] }, "ordersIds": { "type": "array", "description": "Orders IDs.", "items": { "type": "string" } }, "ordersSerialNumbers": { "type": "array", "description": "Order serial numbers.", "items": { "type": "number" } }, "clients": { "type": "array", "description": "Customer data.", "items": { "type": "object", "properties": { "clientLogin": { "type": "string", "description": "Customer's login." }, "clientFirstName": { "type": "string", "description": "Customer's first name." }, "clientLastName": { "type": "string", "description": "Customer's last name." }, "clientCity": { "type": "string", "description": "Customer's city." }, "clientEmail": { "type": "string", "description": "E-mail address." }, "clientHasTaxNumber": { "type": "string", "description": "Parameter can be used to search for orders assigned to customer with VAT number.\n            Available values:\n            \"y\" - customer has VAT number,\n            \"n\" - customer does not have VAT number." }, "clientSearchingMode": { "type": "string", "description": "Parameter allows to choose, by which data orders should be searched. Includes city, firstname, lastname.\n            Available values:\n            \"billing_data\" - search by billing data - default,\n            \"delivery_data\"- search by delivery data,\n            \"billing_delivery_data\" - search by billing and delivery data." }, "clientFirm": { "type": "string", "description": "Customer's company name." }, "clientCountryId": { "type": "string", "description": "Country ID in accordance with ISO-3166." }, "clientCountryName": { "type": "string", "description": "Region name takes priority over clientCountryId." } } } }, "ordersRange": { "type": "object", "description": "Ranges of dates or serial numbers.", "properties": { "ordersDateRange": { "type": "object", "description": "Data for date range", "properties": { "ordersDateType": { "type": "string", "description": "Type of date according to the orders are searched.\n            Type of date listing:\n            \"add\" - date of order was placed,\n            \"modified\" - date of order modification,\n            \"dispatch\" - date or order dispatch,\n            \"payment\" - date of order payment,\n            \"last_payments_operation\" - date of last payment operation,\n            \"declared_payments\" - date of last payment.", "enum": ["add", "modified", "dispatch", "payment", "last_payments_operation", "declared_payments"] }, "ordersDatesTypes": { "type": "array", "description": "Date chart according to which orders are searched.\n            Type of date listing:\n            \"add\" - date of order was placed,\n            \"modified\" - date of order modification,\n            \"dispatch\" - date or order dispatch,\n            \"payment\" - date of order payment.\n            \"last_payments_operation\" - date of last payment operation,\n            \"declared_payments\" - date of last payment.", "items": { "type": "object", "properties": { "ordersDatesType": { "type": "string", "description": "", "enum": ["add", "modified", "dispatch", "payment", "last_payments_operation", "declared_payments"] } } } }, "ordersDateBegin": { "type": "string", "description": "Beginning date in YYYY-MM-DD HH:MM:SS format." }, "ordersDateEnd": { "type": "string", "description": "Ending date in YYYY-MM-DD HH:MM:SS format." } } }, "ordersSerialNumberRange": { "type": "object", "description": "Data for serial number range.", "properties": { "ordersSerialNumberBegin": { "type": "number", "description": "Starting number of serial numbers range for sought products." }, "ordersSerialNumberEnd": { "type": "number", "description": "Ending number for serial number range." } } } } }, "orderSource": { "type": "object", "description": "Order source data.", "properties": { "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } }, "auctionsParams": { "type": "object", "description": "Object used for order searching based on auctions' parameters.", "properties": { "auctionsServicesNames": { "type": "array", "description": "Auction sites names.\n            Auction sites listing:\n            \"allegro\" - Allegro.pl,\n            \"testwebapi\" - Allegro.pl test site,\n            \"ebay\" - eBay.", "items": { "type": "string" } }, "auctionsItemsIds": { "type": "array", "description": "Auctions' numbers.", "items": { "type": "number" } }, "auctionsAccounts": { "type": "array", "description": "Auction sites accounts' data.", "items": { "type": "object", "properties": { "auctionsAccountId": { "type": "number", "description": "Auction service account Id ." }, "auctionsAccountLogin": { "type": "string", "description": "External marketplace service account name (which the listing was created from)." } } } }, "auctionsClients": { "type": "array", "description": "Client's account on auction site data.", "items": { "type": "object", "properties": { "auctionClientId": { "type": "string", "description": "Account ID on auction site." }, "auctionClientLogin": { "type": "string", "description": "Account login on auction site." } } } } } } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productName": { "type": "string", "description": "Product name." }, "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" } } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "clientRequestInvoice": { "type": "string", "description": "Customer asked for invoice.\n                List of parameters:\n                \"invoice\" - yes (paper invoicing ),\n                \"e_invoice\" - yes (electronic invoicing ),\n                \"n\" - no." }, "packages": { "type": "object", "description": "Information on consignments.", "properties": { "packagesNumbers": { "type": "array", "description": "Consignments numbers.", "items": { "type": "string" } }, "orderHasPackageNumbers": { "type": "string", "description": "Does order have consignment number assigned.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." } } }, "stocks": { "type": "array", "description": "Stock quantities data.", "items": { "type": "object", "properties": { "stockId": { "type": "number", "description": "Stock ID" } } } }, "campaign": { "type": "object", "description": "Used discount codes data.", "properties": { "campaignId": { "type": "number", "description": "Campaign ID." }, "discountCodes": { "type": "array", "description": "Discount codes.", "items": { "type": "string" } } } }, "loyaltyPointsMode": { "type": "string", "description": "Loyalty points.", "enum": ["all", "given", "taken", "given_or_taken", "given_and_taken", "not_given_nor_taken"] }, "orderOperatorLogin": { "type": "string", "description": "Order handler." }, "orderPackingPersonLogin": { "type": "string", "description": "Order picker." }, "ordersBy": { "type": "array", "description": "Possibility of sorting returned list", "items": { "type": "object", "properties": { "elementName": { "type": "string", "description": "Field name by which a list will be sorted.\n                Available values:\n                \"id\" - product ID,\n                \"sn\" - Order serial number,\n                \"order_time\" - time of order,\n                \"status\" - Order status,\n                \"order_source\" - Order source,\n                \"order_cost\" - Order amount,\n                \"discount_code\" - Discount code,\n                \"ready_to_send_date\" - Ready to ship." }, "sortDirection": { "type": "string", "description": "Determines sorting direction.\n            Available values:\n            \"ASC\" - ascending,\n            \"DESC\" - descending." } } } }, "searchingOperatorTypeMatch": { "type": "string", "description": "Method of searching orders by handler.", "enum": ["no_assignment", "no_empty", "empty"] }, "ordersDelayed": { "type": "string", "description": "Orders with the exceeded date of shipment.", "enum": ["y", "n"] } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/orders/unfinished/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_warehouse_get", {
    name: "orders_warehouse_get",
    description: `Method that enables getting information about which warehouse an order is being handled from.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." } }, "required": ["orderSerialNumber"] },
    method: "get",
    pathTemplate: "/orders/warehouse",
    executionParameters: [{ "name": "orderSerialNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["orders_warehouse_put", {
    name: "orders_warehouse_put",
    description: `Method that enables setting which warehouse an order is handled from.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "stockId": { "type": "number", "description": "Stock ID" }, "orderOperatorLogin": { "type": "string", "description": "Order handler." }, "externalStockId": { "type": "string", "description": "External warehouse ID (if required)", "enum": ["amazonde", "amazones", "amazonfr", "amazonit", "amazoncouk", "amazonnl", "amazonse", "amazoncomtr", "amazonae", "amazonus", "amazonpl"] } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/orders/warehouse",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["packages_labels_get", {
    name: "packages_labels_get",
    description: `The method allows you to download labels for the courier from orders, complaints and returns.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "eventId": { "type": "number", "description": "Id." }, "eventType": { "type": "string", "description": "Event type", "enum": ["order", "rma", "return"] } }, "required": ["eventId", "eventType"] },
    method: "get",
    pathTemplate: "/packages/labels",
    executionParameters: [{ "name": "eventId", "in": "query" }, { "name": "eventType", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["packages_labels_post", {
    name: "packages_labels_post",
    description: `The method is used to generate shipments and printouts for the courier in orders, complaints and returns. When generating a label with a default courier configuration, it is not necessary to complete the shipment configuration options. To generate a custom label, you must additionally forward the shipment configuration options available to the courier in a given event (parcelParameters node). Completable configuration options can be checked using the getPackages method.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "eventId": { "type": "number", "description": "Id." }, "eventType": { "type": "string", "description": "Type.", "enum": ["order", "rma", "return"] }, "parcelParameters": { "type": "array", "description": "Shipment configuration options available for a given courier", "items": { "type": "object", "properties": { "id": { "type": "string", "description": "Configuration option identifier for the shipment" }, "value": { "type": "string", "description": "The value of the configuration option for the shipment" } } } }, "parcelParametersByPackages": { "type": "array", "description": "Shipment configuration options available for Inpost Smile courier", "items": { "type": "object", "properties": { "packageId": { "type": "string", "description": "Package ID in system." }, "parcelParameters": { "type": "array", "description": "Shipment configuration options available for a given courier", "items": { "type": "object", "properties": { "id": { "type": "string", "description": "Configuration option identifier for the shipment" }, "value": { "type": "string", "description": "The value of the configuration option for the shipment" } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/packages/labels",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["packages_packages_put", {
    name: "packages_packages_put",
    description: `Method that enables editing parcels already assigned to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderPackages": { "type": "array", "description": "List of parcels assigned to the order Maximum default number: 100 parcels.", "items": { "type": "object", "properties": { "orderId": { "type": "string", "description": "Order ID." }, "orderType": { "type": "string", "description": "Order type.\n            Allowed values.\n            \"retail\" - retail order,\n            \"wholesale\" - wholesale order (can be added only by customer with wholesale account registered).\n            Default value:: \"retail\"", "enum": ["order", "rma", "return"] }, "packages": { "type": "array", "description": "Information on consignments.", "items": { "type": "object", "properties": { "packageId": { "type": "number", "description": "Package ID in system." }, "delivery": { "type": "number", "description": "Courier Id." }, "packageNumber": { "type": "string", "description": "Number of the parcel in the shipmnet given by the courier. Returned only if the courier supports parcel numbers" }, "shippingNumber": { "type": "string", "description": "Shipment number provided by the courier. Returned only if the courier supports tracking numbers" }, "packageParameters": { "type": "string", "description": "Package parameters (this option is temporarily unavailable)." }, "shippingStoreCosts": { "type": "object", "description": "Cost for shop.", "properties": { "amount": { "type": "number", "description": "Value.", "format": "float" }, "tax": { "type": "number", "description": "Value Added Tax.", "format": "float" } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/packages/packages",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["packages_packages_post", {
    name: "packages_packages_post",
    description: `Method that enables adding parcels to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "orderPackages": { "type": "array", "description": "List of parcels assigned to the order Maximum default number: 100 parcels.", "items": { "type": "object", "properties": { "orderId": { "type": "string", "description": "Order ID." }, "orderType": { "type": "string", "description": "Order type.\n            Allowed values.\n            \"retail\" - retail order,\n            \"wholesale\" - wholesale order (can be added only by customer with wholesale account registered).\n            Default value:: \"retail\"", "enum": ["order", "rma", "return"] }, "packages": { "type": "array", "description": "Information on consignments.", "items": { "type": "object", "properties": { "delivery": { "type": "number", "description": "Courier Id." }, "packageNumber": { "type": "string", "description": "Number of the parcel in the shipmnet given by the courier. Returned only if the courier supports parcel numbers" }, "shippingNumber": { "type": "string", "description": "Shipment number provided by the courier. Returned only if the courier supports tracking numbers" }, "packageParameters": { "type": "string", "description": "Package parameters (this option is temporarily unavailable)." }, "shippingStoreCosts": { "type": "object", "description": "Cost for shop.", "properties": { "amount": { "type": "number", "description": "Value.", "format": "float" }, "tax": { "type": "number", "description": "Value Added Tax.", "format": "float" } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/packages/packages",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["packages_packages_delete", {
    name: "packages_packages_delete",
    description: `This call is used to remove parcels assigned to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "packageId": { "type": "number", "description": "Parcels's ID" } }, "required": ["packageId"] },
    method: "delete",
    pathTemplate: "/packages/packages",
    executionParameters: [{ "name": "packageId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["packages_packages_search_post", {
    name: "packages_packages_search_post",
    description: `Method that enables getting a list of parcels assigned to an order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "deliveryPackageNumbers": { "type": "array", "description": "Consignments numbers.", "items": { "type": "string" } }, "events": { "type": "array", "description": "Element, package is assigned to", "items": { "type": "object", "properties": { "eventType": { "type": "string", "description": "Type.", "enum": ["order", "rma", "return"] }, "eventsIds": { "type": "array", "description": "IDs.", "items": { "type": "number" } } } } }, "returnLabels": { "type": "boolean", "description": "Return parcel labels." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/packages/packages/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_cancel_post", {
    name: "payments_cancel_post",
    description: `Method that enables cancelling payments for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Defines payment category. For the payments regarding returns, enter 'return'.", "enum": ["order", "return", "rma"] }, "paymentNumber": { "type": "string", "description": "Payment number - [order no.]-[payment no.], i.e. 1234-1." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/payments/cancel",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_cashback_post", {
    name: "payments_cashback_post",
    description: `The method allows to send refund requests (so called cashback) for payments managed by external payment systems which have such option available..
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "", "enum": ["order", "return"] }, "paymentNumber": { "type": "string", "description": "Payment number - [order no.]-[payment no.], i.e. 1234-1." }, "value": { "type": "number", "description": "Refund value.", "format": "float" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/payments/cashback",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_confirm_put", {
    name: "payments_confirm_put",
    description: `Method that enables accepting payments for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Defines payment category. For the payments regarding returns, enter 'return'.", "enum": ["order", "return", "rma"] }, "paymentNumber": { "type": "string", "description": "Payment number - [order no.]-[payment no.], i.e. 1234-1." }, "accountingDate": { "type": "string", "description": "Registering date" } } }, "settings": { "type": "object", "description": "Settings", "properties": { "sendMail": { "type": "boolean", "description": "Indicates if a customer should be informed about allocating the payment by email." }, "sendSms": { "type": "boolean", "description": "Indicates if a customer should be informed about allocating the payment by SMS." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/payments/confirm",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_forms_get", {
    name: "payments_forms_get",
    description: `Method that enables getting information about payment methods available in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "activeOnly": { "type": "string", "description": "Return only active forms of payment.", "enum": ["yes", "no"] } } },
    method: "get",
    pathTemplate: "/payments/forms",
    executionParameters: [{ "name": "activeOnly", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_payments_get", {
    name: "payments_payments_get",
    description: `Method that enables getting information about payments for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "paymentNumber": { "type": "string", "description": "Payment number consists of: source ID (order / return ID) and the payment ordinal number, e.g. 1234-1." }, "sourceType": { "type": "string", "description": "Source type.", "enum": ["order", "return", "rma"] } }, "required": ["paymentNumber", "sourceType"] },
    method: "get",
    pathTemplate: "/payments/payments",
    executionParameters: [{ "name": "paymentNumber", "in": "query" }, { "name": "sourceType", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_payments_put", {
    name: "payments_payments_put",
    description: `Method that enables editing payments for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Defines payment category. For the payments regarding returns, enter 'return'.", "enum": ["order", "return", "rma"] }, "paymentNumber": { "type": "string", "description": "Payment number - [order no.]-[payment no.], i.e. 1234-1." }, "paymentFormId": { "type": "number", "description": "Payment method ID. Check getPaymentForms." }, "value": { "type": "number", "description": "Refund value.", "format": "float" }, "accountingDate": { "type": "string", "description": "Registering date." }, "account": { "type": "string", "description": "Number of a bank account to which a payment is sent." }, "clientAccount": { "type": "string", "description": "Data of customer account in store." }, "other": { "type": "object", "description": "", "properties": { "system": { "type": "number", "description": "Payment system." } } }, "externalPaymentId": { "type": "string", "description": "Transaction ID in external service" } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/payments/payments",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_payments_post", {
    name: "payments_payments_post",
    description: `Method that enables adding payments to orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceId": { "type": "number", "description": "Source ID." }, "sourceType": { "type": "string", "description": "Source type.", "enum": ["order", "return", "rma"] }, "value": { "type": "number", "description": "Payment amount.", "format": "float" }, "account": { "type": "string", "description": "Number of a bank account to which a payment is sent." }, "type": { "type": "string", "description": "", "enum": ["payment", "advance", "repayment", "fee"] }, "paymentFormId": { "type": "number", "description": "Form of payment ID." }, "paymentVoucherKey": { "type": "string", "description": "Gift card or voucher number" }, "giftCardPIN": { "type": "number", "description": "Gift card PIN." }, "externalPaymentId": { "type": "string", "description": "Transaction ID in external service" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/payments/payments",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_profiles_get", {
    name: "payments_profiles_get",
    description: `Allows to download all of the payment profiles defined in the administration panel
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/payments/profiles",
    executionParameters: [{ "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["payments_repayment_post", {
    name: "payments_repayment_post",
    description: `Method that enables adding withdrawals for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "source_id": { "type": "number", "description": "Returns ID." }, "source_type": { "type": "string", "description": "Defines payment category. For the payments regarding returns, enter 'return'." }, "value": { "type": "number", "description": "Refund value.", "format": "float" }, "payment_form_id": { "type": "number", "description": "Payment method ID. Check getPaymentForms." }, "account": { "type": "string", "description": "Number of a bank account to which a payment is sent." }, "client_account": { "type": "string", "description": "Customer account." }, "other": { "type": "object", "description": "Other.", "properties": { "system": { "type": "number", "description": "Payment system." }, "number": { "type": "string", "description": "Number." }, "month": { "type": "number", "description": "Month.", "format": "float" }, "year": { "type": "number", "description": "Year." }, "securityCode": { "type": "string", "description": "Security code." }, "name": { "type": "string", "description": "Name." } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/payments/repayment",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["pictures_list_post", {
    name: "pictures_list_post",
    description: `List of pictures assigned to product.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Product pictures list request", "properties": { "productId": { "type": "number" }, "shopId": { "type": "number" }, "inTrash": { "type": "boolean" }, "picturesMacroType": { "type": "string", "enum": ["small", "medium", "large"] }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" } }, "type": "object", "title": "ProductPicturesViewRequest", "x-readme-ref-name": "ProductPicturesViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/pictures/list",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["pictures_recovery_post", {
    name: "pictures_recovery_post",
    description: `Picture recover from trash.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Product pictures recover request", "properties": { "pictures": { "description": "Product picture recover data", "type": "array", "items": { "description": "Product picture recover data", "properties": { "productId": { "type": "number" }, "pictureName": { "description": "Picture name", "type": "string" }, "originalCephKey": { "description": "Picture cephKey, unique hash for picture", "type": "string", "pattern": "^[a-f0-9]{32}$" } }, "type": "object", "title": "ProductPictureRecoverData", "x-readme-ref-name": "ProductPictureRecoverData" } } }, "type": "object", "title": "ProductPicturesRecoverRequest", "x-readme-ref-name": "ProductPicturesRecoverRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/pictures/recovery",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_SKUbyBarcode_get", {
    name: "products_SKUbyBarcode_get",
    description: `The method allows to download, among others, information on identifiers, names and size codes, their available stock quantity and locations in the warehouse based on scanned bar codes.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "productIndices": { "type": "array", "description": "List of sought products by indexes.", "items": { "type": "string" } }, "searchOnlyInCodeIai": { "type": "boolean", "description": "Search for products only by IAI code" } } },
    method: "get",
    pathTemplate: "/products/SKUbyBarcode",
    executionParameters: [{ "name": "productIndices", "in": "query" }, { "name": "searchOnlyInCodeIai", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_attachments_getContent_get", {
    name: "products_attachments_getContent_get",
    description: `The method allows return the content of a product attachment in Base64 format or as a URL
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "productIdentValue": { "type": "string", "description": "- product identifier value" }, "productIdentType": { "type": "string", "enum": ["codeExtern", "codeProducer", "index", "id"], "description": "- product identifier type" }, "attachmentId": { "type": "number", "description": "- product attachment ID" } }, "required": ["productIdentValue", "productIdentType", "attachmentId"] },
    method: "get",
    pathTemplate: "/products/attachments/getContent",
    executionParameters: [{ "name": "productIdentValue", "in": "query" }, { "name": "productIdentType", "in": "query" }, { "name": "attachmentId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_attachments_put", {
    name: "products_attachments_put",
    description: `Method that enables adding and editing product attachments.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "productsAttachments": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "identValue": { "type": "string", "description": "ID value." }, "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] } } }, "attachments": { "type": "array", "description": "Product attachments list.", "items": { "type": "object", "properties": { "attachmentUrl": { "type": "string", "description": "Attachment file link." }, "attachmentName": { "type": "string", "description": "Attachment name." }, "langId": { "type": "string", "description": "Language ID" }, "attachmentFileType": { "type": "string", "description": "File type: audio, video, doc, other.", "enum": ["audio", "video", "doc", "other", "image"] }, "attachmentEnable": { "type": "string", "description": "Type of customer, attachment should be available for: 'all','ordered','wholesaler','wholesaler_or_ordered','wholesaler_and_ordered'.", "enum": ["all", "ordered", "wholesaler", "wholesaler_or_orderer", "wholesaler_and_ordered"] }, "attachmentId": { "type": "number", "description": "Attachment ID." }, "attachmentDownloadLog": { "type": "string", "description": "Attachment downloads record.", "enum": ["y", "n"] }, "attachmentFileExtension": { "type": "string", "description": "Attachment file extension." }, "attachmentPriority": { "type": "number", "description": "Attachment number." }, "attachmentToDelete": { "type": "boolean", "description": "Flag indicating if an attachment should be removed." }, "documentTypes": { "type": "array", "description": "Attachment document types list.", "items": { "type": "object", "properties": { "documentType": { "type": "string", "description": "Document type.", "enum": ["energy_label", "instruction_with_safety_information", "user_manual", "installation_instructions", "product_card", "guide", "software_data_processing", "hardware_data_processing", "image_of_packaging", "label_of_packaging", "declaration_of_conformity", "image_of_ukca_ce_mark", "others"] }, "description": { "type": "string", "description": "Additional description." } } } } } } }, "virtualAttachments": { "type": "array", "description": "List of product's virtual attachments.", "items": { "type": "object", "properties": { "attachmentUrl": { "type": "string", "description": "Attachment file link." }, "attachmentName": { "type": "object", "description": "Attachment name.", "properties": { "attachmentLanguages": { "type": "array", "description": "List of languages.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "langValue": { "type": "string", "description": "Literal in selected language." } } } } } }, "attachmentType": { "type": "string", "description": "Full version or sample.", "enum": ["full", "demo"] }, "attachmentLimits": { "type": "object", "description": "Number of attachment downloads limit.", "properties": { "attachmentDownloadsLimit": { "type": "number", "description": "Number of downloads limit." }, "attachmentDaysLimit": { "type": "number", "description": "Number of days file should be available." } } }, "attachmentId": { "type": "number", "description": "Attachment ID." }, "attachmentPriority": { "type": "number", "description": "Attachment number." }, "errors": { "type": "object", "description": "Information on error that occurred during gate call.", "properties": { "faultCode": { "type": "number", "description": "Error code." }, "faultString": { "type": "string", "description": "Error description." } } }, "attachmentToDelete": { "type": "boolean", "description": "Flag indicating if an attachment should be removed." } } } }, "errors": { "type": "object", "description": "Information on error that occurred during gate call.", "properties": { "faultCode": { "type": "number", "description": "Error code." }, "faultString": { "type": "string", "description": "Error description." } } }, "attachmentsErrorsOccurred": { "type": "boolean", "description": "Flag indicating if there are errors in results of attachments settings." }, "virtualAttachmentsErrorsOccurred": { "type": "boolean", "description": "Flag indicating if there are errors in results of virtual attachments settings." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/attachments",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_auctions_get", {
    name: "products_auctions_get",
    description: `Allows for downloading information about auctions and auction categories to which the product has been assigned (for a maximum of 100 products in one request)
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "description": "Product identifier type", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "products": { "type": "array", "description": "Products list.", "items": { "type": "string", "description": "ID value." } }, "auctionSites": { "type": "array", "description": "Array of auction site IDs", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/products/auctions",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "products", "in": "query" }, { "name": "auctionSites", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_brands_delete_post", {
    name: "products_brands_delete_post",
    description: `The method allows you to remove brands from the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "ids": { "type": "array", "description": "#!IdentyfikatoryProducentow!#", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/brands/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_brands_filter_get", {
    name: "products_brands_filter_get",
    description: `The method allows you to download a list of filters for brands (manufacturers) available in the IdoSell administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "producerId": { "type": "number", "description": "Brand ID" } }, "required": ["shopId", "languageId", "producerId"] },
    method: "get",
    pathTemplate: "/products/brands/filter",
    executionParameters: [{ "name": "shopId", "in": "query" }, { "name": "languageId", "in": "query" }, { "name": "producerId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_brands_filter_put", {
    name: "products_brands_filter_put",
    description: `The method allows you to manage filter settings for brands (manufacturers).
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "producerId": { "type": "number", "description": "Brand ID" }, "filterForNodeIsDefault": { "type": "string", "description": "", "enum": ["y", "n"] }, "filtersActive": { "type": "array", "description": "Active filters.", "items": { "type": "object", "properties": { "filterId": { "type": "string", "description": "Menu filter ID." }, "filterName": { "type": "string", "description": "Filter name on page." }, "filterDisplay": { "type": "string", "description": "Display as: \"name\" - text, \"gfx\" - graphics, \"namegfx\" - text and graphics.", "enum": ["name", "gfx", "namegfx"] }, "filterValueSort": { "type": "string", "description": "Sort by: \"y\" - alfabetically, \"n\" - by frequency and order of occurrence of indicated parameter value in found products, \"priority\" - according to value sequence in parameter.", "enum": ["y", "n", "priority"] }, "filterDefaultEnabled": { "type": "string", "description": "Enabled by default .", "enum": ["y", "n"] } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/brands/filter",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_brands_get", {
    name: "products_brands_get",
    description: `Method that returns information about brands available in the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "results_page": { "type": "number", "description": "Result page number." }, "results_limit": { "type": "number", "description": "Number of results on page." }, "languagesIds": { "type": "array", "description": "List of languages", "items": { "type": "string" } } } },
    method: "get",
    pathTemplate: "/products/brands",
    executionParameters: [{ "name": "results_page", "in": "query" }, { "name": "results_limit", "in": "query" }, { "name": "languagesIds", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_brands_put", {
    name: "products_brands_put",
    description: `The method allows you to update brands information available in the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "producers": { "type": "array", "description": "List of manufacturers assigned to sought products.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Id" }, "nameInPanel": { "type": "string", "description": "Name in panel" }, "imagesSettings": { "type": "object", "description": "", "properties": { "sourceType": { "type": "string", "description": "Images source type. Available values: base64 - image data encoded using the base64 algorithm (default), url - image file link", "enum": ["base64", "url"] } } }, "languagesConfigurations": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productsListImagesConfiguration": { "type": "object", "description": "", "properties": { "graphicType": { "type": "string", "description": "Type of graphics", "enum": ["img", "img_rwd"] }, "singleGraphic": { "type": "string", "description": "Image (one size for computers, tablets and smartphones, not recommended)" }, "pcGraphic": { "type": "string", "description": "#!GrafikaDlaEkranowKomputera#!" }, "tabletGraphic": { "type": "string", "description": "Graphics for tablets" }, "phoneGraphic": { "type": "string", "description": "Graphics for smartphones" } } }, "productCardImagesConfiguration": { "type": "object", "description": "Graphic displayed on product card", "properties": { "graphicType": { "type": "string", "description": "Type of graphics", "enum": ["img", "img_rwd"] }, "singleGraphic": { "type": "string", "description": "Image (one size for computers, tablets and smartphones, not recommended)" }, "pcGraphic": { "type": "string", "description": "#!GrafikaDlaEkranowKomputera#!" }, "tabletGraphic": { "type": "string", "description": "Graphics for tablets" }, "phoneGraphic": { "type": "string", "description": "Graphics for smartphones" } } }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "shopsConfigurations": { "type": "array", "description": "", "items": { "type": "object", "properties": { "name": { "type": "string", "description": "Name." }, "headerName": { "type": "string", "description": "Name displayed in the website header" }, "descriptionTop": { "type": "string", "description": "Description displayed at the top of products list" }, "descriptionBottom": { "type": "string", "description": "Description displayed at the bottom of products list" }, "shopId": { "type": "number", "description": "Shop Id" }, "view": { "type": "string", "description": "Products display settings", "enum": ["default", "own"] }, "enableSort": { "type": "boolean", "description": "Enable customers to change sorting" }, "enableChangeDisplayCount": { "type": "boolean", "description": "Enable customers to change the number of products displayed" }, "numberOfProductsGrid": { "type": "number", "description": "Number of displayed products" }, "sortModeGrid": { "type": "string", "description": "Selected sorting mode", "enum": ["d_relevance", "d_date", "a_date", "d_priority", "a_priority", "a_priorityname", "d_priorityname", "d_priorityonly", "a_priorityonly", "a_name", "d_name", "a_price", "d_price"] }, "metaSettings": { "type": "string", "description": "Meta settings", "enum": ["auto", "custom"] }, "metaTitle": { "type": "string", "description": "Title" }, "metaDescription": { "type": "string", "description": "Description" }, "metaKeywords": { "type": "string", "description": "Keywords" }, "metaRobotsSettingsIndex": { "type": "string", "description": "Meta robots settings for index attribute", "enum": ["auto", "index", "noindex"] }, "metaRobotsSettingsFollow": { "type": "string", "description": "Meta robots settings for follow attribute", "enum": ["auto", "follow", "nofollow"] } } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/brands",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_brands_post", {
    name: "products_brands_post",
    description: `The method allows you to update brands information available in the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "producers": { "type": "array", "description": "List of manufacturers assigned to sought products.", "items": { "type": "object", "properties": { "nameInPanel": { "type": "string", "description": "Name in panel" }, "imagesSettings": { "type": "object", "description": "", "properties": { "sourceType": { "type": "string", "description": "Images source type. Available values: base64 - image data encoded using the base64 algorithm (default), url - image file link", "enum": ["base64", "url"] } } }, "languagesConfigurations": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productsListImagesConfiguration": { "type": "object", "description": "", "properties": { "graphicType": { "type": "string", "description": "Type of graphics", "enum": ["img", "img_rwd"] }, "singleGraphic": { "type": "string", "description": "Image (one size for computers, tablets and smartphones, not recommended)" }, "pcGraphic": { "type": "string", "description": "#!GrafikaDlaEkranowKomputera#!" }, "tabletGraphic": { "type": "string", "description": "Graphics for tablets" }, "phoneGraphic": { "type": "string", "description": "Graphics for smartphones" } } }, "productCardImagesConfiguration": { "type": "object", "description": "Graphic displayed on product card", "properties": { "graphicType": { "type": "string", "description": "Type of graphics", "enum": ["img", "img_rwd"] }, "singleGraphic": { "type": "string", "description": "Image (one size for computers, tablets and smartphones, not recommended)" }, "pcGraphic": { "type": "string", "description": "#!GrafikaDlaEkranowKomputera#!" }, "tabletGraphic": { "type": "string", "description": "Graphics for tablets" }, "phoneGraphic": { "type": "string", "description": "Graphics for smartphones" } } }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "shopsConfigurations": { "type": "array", "description": "", "items": { "type": "object", "properties": { "name": { "type": "string", "description": "Name." }, "headerName": { "type": "string", "description": "Name displayed in the website header" }, "descriptionTop": { "type": "string", "description": "Description displayed at the top of products list" }, "descriptionBottom": { "type": "string", "description": "Description displayed at the bottom of products list" }, "shopId": { "type": "number", "description": "Shop Id" }, "view": { "type": "string", "description": "Products display settings", "enum": ["default", "own"] }, "enableSort": { "type": "boolean", "description": "Enable customers to change sorting" }, "enableChangeDisplayCount": { "type": "boolean", "description": "Enable customers to change the number of products displayed" }, "numberOfProductsGrid": { "type": "number", "description": "Number of displayed products" }, "sortModeGrid": { "type": "string", "description": "Selected sorting mode", "enum": ["d_relevance", "d_date", "a_date", "d_priority", "a_priority", "a_priorityname", "d_priorityname", "d_priorityonly", "a_priorityonly", "a_name", "d_name", "a_price", "d_price"] }, "metaSettings": { "type": "string", "description": "Meta settings", "enum": ["auto", "custom"] }, "metaTitle": { "type": "string", "description": "Title" }, "metaDescription": { "type": "string", "description": "Description" }, "metaKeywords": { "type": "string", "description": "Keywords" }, "metaRobotsSettingsIndex": { "type": "string", "description": "Array", "enum": ["auto", "index", "noindex"] }, "metaRobotsSettingsFollow": { "type": "string", "description": "Array", "enum": ["auto", "follow", "nofollow"] } } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/brands",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_bundles_bundles_post", {
    name: "products_bundles_bundles_post",
    description: `createBundle method allows to create a new product with a type: set and to assign existing products as a set components. Products added via this gate are hidden from the shop customer by default. To change the visibility of created products use the gate setProducts or set it on a product card in the shop administration panel
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "productSizes": { "type": "array", "description": "Sizes available for products data.", "items": { "type": "object", "properties": { "size": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" } } } }, "addType": { "type": "string", "description": "", "enum": ["selectedSizes", "selectedSizesAsSeparateItems", "allSizes", "allSizesWithVariants"] }, "quantity": { "type": "number", "description": "Quantity of a component in a set", "format": "float" } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/bundles/bundles",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_bundles_products_delete_post", {
    name: "products_bundles_products_delete_post",
    description: `removeProductsFromBundle method allows to remove indicated set components
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } } }, "bundleIdent": { "type": "object", "description": "", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/bundles/products/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_bundles_products_post", {
    name: "products_bundles_products_post",
    description: `addProductsToBundle method allows to add components to existing sets in the administration panel
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "productSizes": { "type": "array", "description": "Sizes available for products data.", "items": { "type": "object", "properties": { "size": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" } } } }, "addType": { "type": "string", "description": "Way of adding a product to a set:\n\t\t\t\t\"selectedSizes\" - Add products in sizes selected by me,\n\t\t\t\t\"selectedSizesAsSeparateItems\" - Add products with chosen sizes as a new item on the list,\n\t\t\t\t\"allSizes\" - Add entire products and leave size selection to customers,\n\t\t\t\t\"allSizesWithVariants\" - Add an entire product with all variants and leave size and variant selection to customers", "enum": ["selectedSizes", "selectedSizesAsSeparateItems", "allSizes", "allSizesWithVariants"] }, "quantity": { "type": "number", "description": "Quantity of a component in a set", "format": "float" } } } }, "bundleIdent": { "type": "object", "description": "", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/bundles/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_bundles_productsQuantity_put", {
    name: "products_bundles_productsQuantity_put",
    description: `setProductsQuantityInBundle method allows to indicate quantity of a set component
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "quantity": { "type": "number", "description": "Quantity of a component in a set", "format": "float" } } } }, "bundleIdent": { "type": "object", "description": "", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/bundles/productsQuantity",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_bundles_renew_put", {
    name: "products_bundles_renew_put",
    description: `the renewProductsInBundle method allows you to rebuild components of Sets existing in the administration panel 
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "Value." } } }, "productSizes": { "type": "array", "description": "Sizes available for products data.", "items": { "type": "object", "properties": { "size": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" } } } }, "addType": { "type": "string", "description": "Way of adding a product to a set:\n                \"selectedSizes\" - Add products in sizes selected by me,\n                \"selectedSizesAsSeparateItems\" - Add products with chosen sizes as a new item on the list,\n                \"allSizes\" - Add entire products and leave size selection to customers,\n                \"allSizesWithVariants\" - Add an entire product with all variants and leave size and variant selection to customers", "enum": ["selectedSizes", "selectedSizesAsSeparateItems", "allSizes", "allSizesWithVariants"] }, "quantity": { "type": "number", "description": "Quantity of a component in a set" } } } }, "bundleIdent": { "type": "object", "description": "ID of a set being modified.", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "Value." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/bundles/renew",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_categories_get", {
    name: "products_categories_get",
    description: `Method that returns information about categories configured in the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "ids": { "type": "array", "description": "List of product category identifiers in the panel", "items": { "type": "number" } }, "languages": { "type": "array", "description": "Array of languages categories names should be returned in. \"Defaults\" value returns categories names in store default language. Not using languages parameter causes a situation, that categories names are returned in all available languages.", "items": { "type": "string" } }, "results_page": { "type": "number", "description": "Result page number." }, "results_limit": { "type": "number", "description": "Number of results on page." }, "return_last_changed_time": { "type": "string", "description": "Returns the date of last modification (YYYY-MM-DD HH-MM-SS)." } } },
    method: "get",
    pathTemplate: "/products/categories",
    executionParameters: [{ "name": "ids", "in": "query" }, { "name": "languages", "in": "query" }, { "name": "results_page", "in": "query" }, { "name": "results_limit", "in": "query" }, { "name": "return_last_changed_time", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_categories_put", {
    name: "products_categories_put",
    description: `Method that enables adding new categories to the administration panel as well editing and deleting of existing categories.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "categories": { "type": "array", "description": "List of categories in which sought products are present.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Category id." }, "parent_id": { "type": "number", "description": "Parent category ID." }, "priority": { "type": "number", "description": "Category priority. Value from 1 to 19." }, "operation": { "type": "string", "description": "Operation code.\n                    Allowed values.\n                    \"add\" - adds new category,\n                    \"edit\" - edits existing category,\n                    \"del\" - deletes existing category." }, "lang_data": { "type": "array", "description": "", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language code. Codes are compliant with ISO-639-3 standard." }, "singular_name": { "type": "string", "description": "Category singular name." }, "plural_name": { "type": "string", "description": "Category plural name." } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/categories",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_categoriesIdosell_search_post", {
    name: "products_categoriesIdosell_search_post",
    description: `Method returns information about IdoSell Categories available in store.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "languagesIds": { "type": "array", "description": "List of languages", "items": { "type": "string", "description": "Language ID (code in ISO 639-2).", "enum": ["pol", "eng", "ger"] } }, "categoriesIdoSellIds": { "type": "array", "description": "Number of IdoSell Categories identifiers", "items": { "type": "string" } }, "categoriesIdoSellNames": { "type": "array", "description": "IdoSell Categories name list", "items": { "type": "string" } }, "categoriesIdoSellPaths": { "type": "array", "description": "IdoSell Categories path list", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/categoriesIdosell/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_codeExistence_get", {
    name: "products_codeExistence_get",
    description: `The method allows to check if a product with the given identification code (panel ID, IAI code, manufacturer code, external system code) exists in the panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer", "codeDeliverer"] }, "products": { "type": "array", "description": "Products list.", "items": { "type": "string", "description": "Stock keeping unit." } }, "delivererId": { "type": "string", "description": "Supplier ID." } }, "required": ["products"] },
    method: "get",
    pathTemplate: "/products/codeExistence",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "products", "in": "query" }, { "name": "delivererId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_collections_post", {
    name: "products_collections_post",
    description: `createCollection method allows to create a new product with a type: collection and to assign existing products as a collection components. Products added via this gate are hidden from the shop customer by default. To change the visibility of created products use the gate setProducts or set it on a product card in the shop administration panel
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Component ID" }, "productSizes": { "type": "array", "description": "Size chart in which a product will be added as a collection component. Required in case of mode selectedSizes and selectedSizesAsSeparateItems in addType", "items": { "type": "object", "properties": { "size": { "type": "string", "description": "Size identifier" } } } }, "addType": { "type": "string", "description": "Way of adding a product to a collection:\n                \"selectedSizes\" - Add products in sizes selected by me,\n                \"selectedSizesAsSeparateItems\" - Add products with chosen sizes as a new item on the list,\n                \"allSizes\" - Add entire products and leave size selection to customers,\n                \"allSizesWithVariants\" - Add an entire product with all variants and leave size and variant selection to customers", "enum": ["selectedSizes", "selectedSizesAsSeparateItems", "allSizes", "allSizesWithVariants"] }, "quantity": { "type": "number", "description": "Quantity of a component in a collection" } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/collections",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_collections_products_delete_post", {
    name: "products_collections_products_delete_post",
    description: `removeProductsFromCollection method allows to remove indicated collection components
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Component ID" } } } }, "collectionId": { "type": "number", "description": "ID of a collection being modified" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/collections/products/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_collections_products_put", {
    name: "products_collections_products_put",
    description: `setProductsQuantityInCollection method allows to indicate quantity of a collection component
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "quantity": { "type": "number", "description": "Quantity of a component in a collection" } } } }, "collectionId": { "type": "number", "description": "ID of a collection being modified." } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/collections/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_collections_products_post", {
    name: "products_collections_products_post",
    description: `addProductsToCollection method allows to add components to existing collections in the administration panel
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Component ID" }, "productSizes": { "type": "array", "description": "Size chart in which a product will be added as a collection component. Required in case of mode selectedSizes and selectedSizesAsSeparateItems in addType", "items": { "type": "object", "properties": { "size": { "type": "string", "description": "Size identifier" } } } }, "addType": { "type": "string", "description": "Way of adding a product to a collection:\n                \"selectedSizes\" - Add products in sizes selected by me,\n                \"selectedSizesAsSeparateItems\" - Add products with chosen sizes as a new item on the list,\n                \"allSizes\" - Add entire products and leave size selection to customers,\n                \"allSizesWithVariants\" - Add an entire product with all variants and leave size and variant selection to customers", "enum": ["selectedSizes", "selectedSizesAsSeparateItems", "allSizes", "allSizesWithVariants"] }, "quantity": { "type": "number", "description": "Quantity of a component in a collection" } } } }, "collectionId": { "type": "number", "description": "ID of a collection being modified" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/collections/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_collections_renew_put", {
    name: "products_collections_renew_put",
    description: `the renewProductsInCollection method allows you to rebuild existing components of Collections in the administration panel 
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "productId": { "type": "string", "description": "Product IAI code" }, "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "codeExtern", "codeProducer"] } } }, "productSizes": { "type": "array", "description": "Size chart in which a product will be added as a collection component. Required in case of mode selectedSizes and selectedSizesAsSeparateItems in addType", "items": { "type": "object", "properties": { "size": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" } } } }, "addType": { "type": "string", "description": "Way of adding a product to a collection:\n                \"selectedSizes\" - Add products in sizes selected by me,\n                \"selectedSizesAsSeparateItems\" - Add products with chosen sizes as a new item on the list,\n                \"allSizes\" - Add entire products and leave size selection to customers,\n                \"allSizesWithVariants\" - Add an entire product with all variants and leave size and variant selection to customers", "enum": ["selectedSizes", "selectedSizesAsSeparateItems", "allSizes", "allSizesWithVariants"] }, "quantity": { "type": "number", "description": "Quantity of a component in a collection" } } } }, "collectionIdent": { "type": "object", "description": "ID of a collection being modified.", "properties": { "collectionId": { "type": "string", "description": "Value." }, "collectionIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "codeExtern", "codeProducer"] } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/collections/renew",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_deliveryTime_search_post", {
    name: "products_deliveryTime_search_post",
    description: `The method returns the time needed to prepare the product for shipment
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "stockId": { "type": "number", "description": "Stock ID" }, "isCollectionInPerson": { "type": "boolean", "description": "Should products be prepared for personal collection?" }, "products": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product Id" }, "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" }, "productIndex": { "type": "string", "description": "Product IAI code" }, "productSizeQuantity": { "type": "number", "description": "Product quantity." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/deliveryTime/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_descriptions_get", {
    name: "products_descriptions_get",
    description: `Method that returns text elements for a given product, e.g. product name, long and short description, metadata.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "type": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "ids": { "type": "array", "description": "ID value.", "items": { "type": "number" } }, "shopId": { "type": "number", "description": "Shop Id" } }, "required": ["type", "ids"] },
    method: "get",
    pathTemplate: "/products/descriptions",
    executionParameters: [{ "name": "type", "in": "query" }, { "name": "ids", "in": "query" }, { "name": "shopId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_descriptions_put", {
    name: "products_descriptions_put",
    description: `The method allows for setting text elements for a given product, e.g. product name, long and short description, metadata.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "productDescriptionsLangData": { "type": "array", "description": "Array of language-dependent elements.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "shopId": { "type": "number", "description": "Shop Id" }, "productName": { "type": "string", "description": "Product name." }, "productAuctionName": { "type": "string", "description": "Product name for auction service." }, "productPriceComparerName": { "type": "string", "description": "Product name for price comparison websites" }, "productDescription": { "type": "string", "description": "Short product description." }, "productLongDescription": { "type": "string", "description": "Long product description." }, "productDescriptionSections": { "type": "object", "properties": { "descriptionSections": { "type": "array", "items": { "type": "object", "properties": { "section_1": { "properties": { "type": { "type": "string", "enum": ["text", "photo", "video", "html"] }, "content": { "type": "string", "description": "HTML content depending on the type" } }, "required": ["type", "content"], "title": "DescriptionSubsection", "x-readme-ref-name": "DescriptionSubsection" }, "section_2": { "properties": { "type": { "type": "string", "enum": ["text", "photo", "video", "html"] }, "content": { "type": "string", "description": "HTML content depending on the type" } }, "required": ["type", "content"], "title": "DescriptionSubsection", "x-readme-ref-name": "DescriptionSubsection" } } } } } }, "productAuctionLongDescription": { "type": "string", "description": "DEPRECATED. This parameter is deprecated. Long product description for external listings." }, "productMetaTitle": { "type": "string", "description": "Product meta title." }, "productMetaDescription": { "type": "string", "description": "Product meta description." }, "productMetaKeywords": { "type": "string", "description": "Product meta keywords." } } } }, "productAuctionDescriptionsData": { "type": "array", "description": "Product data for auction services", "items": { "type": "object", "properties": { "productAuctionId": { "type": "string", "description": "Auction system ID" }, "productAuctionSiteId": { "type": "string", "description": "Auction site ID" }, "productAuctionName": { "type": "string", "description": "Product name for auction service." }, "productAuctionAdditionalName": { "type": "string", "description": "Subtitle for auction service " }, "productAuctionDescription": { "type": "string", "description": "Product description for marketplaces" } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/descriptions",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_groups_groupProducts_put", {
    name: "products_groups_groupProducts_put",
    description: `All products must be of compatible types, and must not exceed the variant limit.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "required": ["request"], "properties": { "request": { "description": "Request for grouping products into a variant group", "required": ["products"], "properties": { "products": { "description": "List of products to group (minimum 2). Each product carries its own identifier, optional isMain flag and per-parameter distinguishing values.", "type": "array", "items": { "description": "Product to be added to a variant group, with optional grouping metadata", "required": ["identValue"], "type": "object", "allOf": [{ "required": ["identValue"], "properties": { "identType": { "description": "Product identifier type", "type": "string", "enum": ["id", "index", "codeExtern", "codeProducer"], "example": "id" }, "identValue": { "description": "Product identifier value", "type": "string", "example": "123" } }, "type": "object", "title": "ProductIdentifier", "x-readme-ref-name": "ProductIdentifier" }, { "properties": { "isMain": { "description": "Marks this product as the main variant of the group. At most one product in the request may be set as main; if none is marked, the first product becomes main.", "type": "boolean", "example": false }, "parameterValues": { "description": "Distinguishing parameter value assignments for this product. Each entry pairs a parameter ID with its value names.", "type": "array", "items": { "description": "Distinguishing values of a single parameter assigned to a product", "required": ["parameterId", "valueNames"], "properties": { "parameterId": { "description": "ID of the parameter (must be a parameter of type \"Distinguishing variants\").", "type": "integer", "example": 5 }, "valueNames": { "description": "Value names for the parameter. Resolved by name in the current panel language; missing values are created automatically.", "type": "array", "items": { "type": "string" }, "example": ["01"] } }, "type": "object", "title": "ParameterValueAssignment", "x-readme-ref-name": "ParameterValueAssignment" }, "nullable": true } } }], "title": "ProductToGroup", "x-readme-ref-name": "ProductToGroup" }, "minItems": 2 }, "groupDistinctionParameterIds": { "description": "IDs of parameters distinguishing products within the group (e.g. size, colour).", "type": ["array", "null"], "items": { "type": "integer" } } }, "type": "object", "title": "GroupProductsRequest", "x-readme-ref-name": "GroupProductsRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/groups/groupProducts",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_groups_mainProduct_put", {
    name: "products_groups_mainProduct_put",
    description: `The method allows you to change the main product in a group of products.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "groups": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/groups/mainProduct",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_groups_order_put", {
    name: "products_groups_order_put",
    description: `The method allows you to change the order of products in a group of products.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "groups": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productsInOrder": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "priority": { "type": "number", "description": "The order of products in the group. Value needs to be more than 0." } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/groups/order",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_groups_settings_put", {
    name: "products_groups_settings_put",
    description: `The method allows you to change the settings for displaying products to a group of products .
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "groups": { "type": "array", "description": "", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "displayInPanel": { "type": "string", "description": "Display on the product list in the panel.", "enum": ["firstAvailable", "all"] }, "displayOnPage": { "type": "string", "description": "Display on a product list on the page.", "enum": ["firstAvailable", "all", "specified"] }, "specifiedProductIdent": { "type": "object", "description": "Selected product in the group.", "properties": { "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/groups/settings",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_groups_ungroupProducts_put", {
    name: "products_groups_ungroupProducts_put",
    description: `Results are returned in the original request order. When the operation does not fully
succeed for every product, the HTTP status is downgraded to 207 Multi-Status.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "required": ["request"], "properties": { "request": { "description": "Request for ungrouping products from their variant group", "required": ["products"], "properties": { "products": { "description": "List of products to ungroup", "type": "array", "items": { "required": ["identValue"], "properties": { "identType": { "description": "Product identifier type", "type": "string", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "description": "Product identifier value", "type": "string" } }, "type": "object", "title": "ProductIdentifier", "x-readme-ref-name": "ProductIdentifier" } } }, "type": "object", "title": "UngroupProductsRequest", "x-readme-ref-name": "UngroupProductsRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/groups/ungroupProducts",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_idBySizecode_get", {
    name: "products_idBySizecode_get",
    description: `Method that returns information about product IDs, as well as size IDs and names, based on the provided product external system codes.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "codes": { "type": "array", "description": "Search codes.", "items": { "type": "string" } }, "type": { "type": "string", "description": "Type of codes. Acceptable values: \"external\" (default value) - external system code, \"producer\" - producer code, and \"all\" - any of the above codes" } } },
    method: "get",
    pathTemplate: "/products/idBySizecode",
    executionParameters: [{ "name": "codes", "in": "query" }, { "name": "type", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_images_delete_post", {
    name: "products_images_delete_post",
    description: `This method is used to delete images of products
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "deleteAll": { "type": "boolean", "description": "Delete all images" }, "productId": { "type": "number", "description": "Product IAI code" }, "shopId": { "type": "number", "description": "Shop Id" }, "productImagesId": { "type": "array", "description": "", "items": { "type": "string" } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/images/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_images_put", {
    name: "products_images_put",
    description: `Method used for adding and editing product pictures.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "productsImagesSettings": { "type": "object", "description": "", "properties": { "productsImagesSourceType": { "type": "string", "description": "How to provide information about images of products.", "enum": ["base64", "url"] }, "productsImagesApplyMacro": { "type": "boolean", "description": "Whether images for products should be scalable." } } }, "productsImages": { "type": "array", "description": "Information on product images", "items": { "type": "object", "properties": { "productIdent": { "type": "object", "description": "", "properties": { "identValue": { "type": "string", "description": "ID value." }, "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] } } }, "shopId": { "type": "number", "description": "Shop Id" }, "otherShopsForPic": { "type": "array", "description": "List of shops for which photos will be added (including shop provided in shopId). If parameter is empty or not provided, photos will be added to all shops.", "items": { "type": "number" } }, "productImages": { "type": "array", "description": "Product photos details.", "items": { "type": "object", "properties": { "productImageSource": { "type": "string", "description": "Product photo." }, "productImageNumber": { "type": "number", "description": "A product photo's number." }, "productImagePriority": { "type": "number", "description": "Picture priority" }, "deleteProductImage": { "type": "boolean", "description": "Flag marking if a picture should be deleted." } } } }, "productIcons": { "type": "array", "description": "Product icons list.", "items": { "type": "object", "properties": { "productIconSource": { "type": "string", "description": "Photo in the goods list." }, "deleteProductIcon": { "type": "boolean", "description": "Flag indicating whether to remove the product icon." }, "productIconType": { "type": "string", "description": "Icon type.", "enum": ["shop", "auction", "group"] } } } }, "productImagesSettings": { "type": "object", "description": "Product settings.", "properties": { "productImagesSourceType": { "type": "string", "description": "How to provide information about images of product.", "enum": ["base64", "url"] }, "productImagesApplyMacro": { "type": "boolean", "description": "Whether images for products should be scalable." } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/images",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_marketing_allFacebookCatalogIds_get", {
    name: "products_marketing_allFacebookCatalogIds_get",
    description: `The method allows you to download available Facebook catalogs in a given store.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" } }, "required": ["shopId"] },
    method: "get",
    pathTemplate: "/products/marketing/allFacebookCatalogIds",
    executionParameters: [{ "name": "shopId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_marketingZones_get", {
    name: "products_marketingZones_get",
    description: `Allows for getting information about products assigned to marketing hot spots
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "products": { "type": "array", "description": "Products list.", "items": { "type": "string", "description": "Value." } } } },
    method: "get",
    pathTemplate: "/products/marketingZones",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "products", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_marketingZones_put", {
    name: "products_marketingZones_put",
    description: `Allows for assigning products to marketing hot spots
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "ident": { "type": "object", "description": "Identifier type.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "value": { "type": "string", "description": "Value." } } }, "assignment_mode": { "type": "string", "description": "", "enum": ["auto", "manual"] }, "marketing_zones": { "type": "object", "description": "", "properties": { "promotion": { "type": "string", "description": "Promoted product.", "enum": ["yes", "no"] }, "discount": { "type": "string", "description": "Product on sale.", "enum": ["yes", "no"] }, "distinguished": { "type": "string", "description": "Distinguished product.", "enum": ["yes", "no"] }, "special": { "type": "string", "description": "Special product.", "enum": ["yes", "no"] } } }, "shops": { "type": "array", "description": "Marketing hotspots in shops", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id" }, "assignment_mode": { "type": "string", "description": "", "enum": ["auto", "manual"] }, "marketing_zones": { "type": "object", "description": "", "properties": { "promotion": { "type": "string", "description": "Promoted product.", "enum": ["yes", "no"] }, "discount": { "type": "string", "description": "Product on sale.", "enum": ["yes", "no"] }, "distinguished": { "type": "string", "description": "Distinguished product.", "enum": ["yes", "no"] }, "special": { "type": "string", "description": "Special product.", "enum": ["yes", "no"] } } } } } } } } }, "assignment_mode": { "type": "string", "description": "", "enum": ["auto", "manual"] }, "marketing_zones": { "type": "object", "description": "", "properties": { "promotion": { "type": "string", "description": "Promoted product.", "enum": ["yes", "no"] }, "discount": { "type": "string", "description": "Product on sale.", "enum": ["yes", "no"] }, "distinguished": { "type": "string", "description": "Distinguished product.", "enum": ["yes", "no"] }, "special": { "type": "string", "description": "Special product.", "enum": ["yes", "no"] } } }, "shops": { "type": "array", "description": "Marketing hotspots in shops", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id" }, "assignment_mode": { "type": "string", "description": "", "enum": ["auto", "manual"] }, "marketing_zones": { "type": "object", "description": "", "properties": { "promotion": { "type": "string", "description": "Promoted product.", "enum": ["yes", "no"] }, "discount": { "type": "string", "description": "Product on sale.", "enum": ["yes", "no"] }, "distinguished": { "type": "string", "description": "Distinguished product.", "enum": ["yes", "no"] }, "special": { "type": "string", "description": "Special product.", "enum": ["yes", "no"] } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/marketingZones",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_omnibusPrices_get", {
    name: "products_omnibusPrices_get",
    description: `Allows you to download information about the lowest prices before promotions
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "products": { "type": "array", "description": "Products list.", "items": { "type": "string", "description": "Product identifier" } } } },
    method: "get",
    pathTemplate: "/products/omnibusPrices",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "products", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_omnibusPrices_put", {
    name: "products_omnibusPrices_put",
    description: `Allows for editing product strikethrough price settings
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "ident": { "type": "object", "description": "Identifier type.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "value": { "type": "string", "description": "Value." } } }, "sizes": { "type": "array", "description": "List of sizes", "items": { "type": "object", "properties": { "ident": { "type": "object", "description": "Identifier type.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "value": { "type": "string", "description": "Value." } } }, "omnibusPrices": { "type": "object", "description": "Strikethrough price settings.", "properties": { "omnibusPriceManagement": { "type": "string", "description": "How to manage the lowest price before promotion.", "enum": ["automatic", "manual"] }, "omnibusPriceRetail": { "type": "number", "description": "Lowest retail price before active promotion (gross).", "format": "float" }, "omnibusPriceWholesale": { "type": "number", "description": "Lowest wholesale price before active promotion (gross).", "format": "float" } } }, "shops": { "type": "array", "description": "Strikethrough price settings for the page.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "omnibusPrices": { "type": "object", "description": "Strikethrough price settings.", "properties": { "omnibusPriceManagement": { "type": "string", "description": "How to manage the lowest price before promotion.", "enum": ["automatic", "manual"] }, "omnibusPriceRetail": { "type": "number", "description": "Lowest retail price before active promotion (gross).", "format": "float" }, "omnibusPriceWholesale": { "type": "number", "description": "Lowest wholesale price before active promotion (gross).", "format": "float" } } } } } } } } }, "omnibusPrices": { "type": "object", "description": "Strikethrough price settings.", "properties": { "omnibusPriceManagement": { "type": "string", "description": "How to manage the lowest price before promotion.", "enum": ["automatic", "manual"] }, "omnibusPriceRetail": { "type": "number", "description": "Lowest retail price before active promotion (gross).", "format": "float" }, "omnibusPriceWholesale": { "type": "number", "description": "Lowest wholesale price before active promotion (gross).", "format": "float" } } }, "shops": { "type": "array", "description": "Strikethrough price settings for the page.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "omnibusPrices": { "type": "object", "description": "Strikethrough price settings.", "properties": { "omnibusPriceManagement": { "type": "string", "description": "How to manage the lowest price before promotion.", "enum": ["automatic", "manual"] }, "omnibusPriceRetail": { "type": "number", "description": "Lowest retail price before active promotion (gross).", "format": "float" }, "omnibusPriceWholesale": { "type": "number", "description": "Lowest wholesale price before active promotion (gross).", "format": "float" } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/omnibusPrices",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_opinions_opinions_delete_post", {
    name: "products_opinions_opinions_delete_post",
    description: `The method allows to delete the feedback about the commodity from the panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "id": { "type": "number", "description": "" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/opinions/opinions/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_opinions_opinions_get", {
    name: "products_opinions_opinions_get",
    description: `The method allows for downloading information about reviews issued for products available in the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "opinion": { "type": "object", "description": "Review identification", "properties": { "id": { "type": "number", "description": "" }, "language": { "type": "string", "description": "Customer language ID." }, "confirmed": { "type": "boolean", "description": "" }, "host": { "type": "string", "description": "" }, "shopId": { "type": "number", "description": "Shop Id" } } }, "products": { "type": "object", "description": "Products list.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "value": { "type": "string", "description": "" } } }, "clients": { "type": "object", "description": "Customer data.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "login", "codeExtern"] }, "value": { "type": "string", "description": "" } } }, "scorePositive": { "type": "object", "description": "Review positive score data", "properties": { "from": { "type": "number", "description": "Amount of positive score from" }, "to": { "type": "number", "description": "Amount of positive score to" } } }, "scoreNegative": { "type": "object", "description": "Review negative score data", "properties": { "from": { "type": "number", "description": "Amount of negative score from" }, "to": { "type": "number", "description": "Amount of negative score to" } } }, "dateRange": { "type": "object", "description": "Date range", "properties": { "begin": { "type": "string", "description": "" }, "end": { "type": "string", "description": "" } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "ordersBy": { "type": "array", "description": "Possibility of sorting returned list", "items": { "type": "object", "properties": { "elementName": { "type": "string", "description": "Field name by which a list will be sorted.\n                Available values:\n                \"date\" - Date of adding an opinion,\n                \"rating\" - Rating attached to opinion,\n                \"scorePositive\" - Usefulness of the opinion - number of positive ratings,\n                \"scoreNegative\" - Usefulness of the opinion - number of negative ratings,\n                \"modificationDatetime\" - Last modification date" }, "sortDirection": { "type": "string", "description": "Determines sorting direction.\n            Available values:\n            \"ASC\" - ascending,\n            \"DESC\" - descending." } } } } } },
    method: "get",
    pathTemplate: "/products/opinions/opinions",
    executionParameters: [{ "name": "opinion", "in": "query" }, { "name": "products", "in": "query" }, { "name": "clients", "in": "query" }, { "name": "scorePositive", "in": "query" }, { "name": "scoreNegative", "in": "query" }, { "name": "dateRange", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }, { "name": "ordersBy", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_opinions_opinions_put", {
    name: "products_opinions_opinions_put",
    description: `The method allows to edit opinions about goods available in the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "id": { "type": "number", "description": "" }, "confirmed": { "type": "string", "description": "", "enum": ["y", "n"] }, "rating": { "type": "number", "description": "", "enum": ["1", "2", "3", "4", "5"] }, "content": { "type": "string", "description": "" }, "language": { "type": "string", "description": "Customer language ID." }, "shopAnswer": { "type": "string", "description": "Reply to an opinion" }, "picture": { "type": "string", "description": "" }, "opinionConfirmedByPurchase": { "type": "boolean", "description": "Opinion confirmed with purchase" } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/opinions/opinions",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_opinions_opinions_post", {
    name: "products_opinions_opinions_post",
    description: `The method allows for adding reviews of products available in the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "opinions": { "type": "array", "description": "List of reviews", "items": { "type": "object", "properties": { "createDate": { "type": "string", "description": "" }, "confirmed": { "type": "boolean", "description": "" }, "rating": { "type": "string", "description": "" }, "content": { "type": "string", "description": "" }, "language": { "type": "string", "description": "Customer language ID." }, "picture": { "type": "string", "description": "" }, "shopId": { "type": "number", "description": "Shop Id" }, "host": { "type": "string", "description": "" }, "clients": { "type": "object", "description": "Customer data.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "login", "codeExtern"] }, "value": { "type": "string", "description": "" }, "name": { "type": "string", "description": "Name." }, "email": { "type": "string", "description": "E-mail address" } } }, "scorePositive": { "type": "number", "description": "" }, "scoreNegative": { "type": "number", "description": "" }, "products": { "type": "object", "description": "Products list.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "value": { "type": "string", "description": "" } } }, "orderSerialNumber": { "type": "number", "description": "Order serial number." }, "shopAnswer": { "type": "string", "description": "Reply to an opinion" }, "opinionConfirmedByPurchase": { "type": "boolean", "description": "Opinion confirmed with purchase" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/opinions/opinions",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_opinions_rate_get", {
    name: "products_opinions_rate_get",
    description: `Evaluation of the usefulness of opinions issued for products.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "number", "description": "" }, "operation": { "type": "string", "description": "", "enum": ["positive", "negative"] } }, "required": ["id", "operation"] },
    method: "get",
    pathTemplate: "/products/opinions/rate",
    executionParameters: [{ "name": "id", "in": "query" }, { "name": "operation", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_parameters_delete_post", {
    name: "products_parameters_delete_post",
    description: `The method allows you to delete parameters and their values (for parameters that are not pinned to any product)..
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "ids": { "type": "array", "description": "Parameter identifiers", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/parameters/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_parameters_put", {
    name: "products_parameters_put",
    description: `Method that enables adding and editing of sections and parameters, modifying their values and setting their order.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "items": { "type": "array", "description": "Sections, parameters or valued to add or edit.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Parameter ID." }, "item_text_ids": { "type": "array", "description": "Element text ID - can be entered instead of \"id\".\n                        Recognized save format: \"section\" (without backslash), \"parameter\\\" (parameter without assigned value).", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID." }, "value": { "type": "string", "description": "Text value." } } } }, "names": { "type": "array", "description": "Names of section, parameter or value.", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID." }, "value": { "type": "string", "description": "Text value." } } } }, "descriptions": { "type": "array", "description": "Descriptions of section, parameter or value.", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID." }, "value": { "type": "string", "description": "Text value." } } } }, "search_description": { "type": "array", "description": "Search descriptions of parameter value.", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID" }, "value": { "type": "string", "description": "Text value" }, "shop_id": { "type": "number", "description": "Shop Id" } } } }, "card_icons": { "type": "array", "description": "Icons of section, parameter or value to display on the product card.", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID." }, "value": { "type": "string", "description": "Text value." }, "shop_id": { "type": "number", "description": "Shop Id" } } } }, "link_icons": { "type": "array", "description": "Icons of section, parameter or value to display on the list of products.", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language ID." }, "value": { "type": "string", "description": "Text value." }, "shop_id": { "type": "number", "description": "Shop Id" } } } }, "context_id": { "type": "string", "description": "Parameter's additional feature.\n                        1. Status:\n                        context_id = \"CONTEXT_STATE\"\n                        Takes values context_value_id:\n                        - CONTEXT_STATE_NEW - New,\n                        - CONTEXT_STATE_USED - Used,\n                        - CONTEXT_STATE_USED_EXCELLENT - Used - excellent condition\n                        - CONTEXT_STATE_USED_VERYGOOD - Used - very good condition\n                        - CONTEXT_STATE_USED_CORRECT - Used - good condition\n                        - CONTEXT_STATE_USED_ACCEPTABLE - Used - acceptable condition\n                        - CONTEXT_STATE_REFURBISHED_EXCELLENT - Refurbished - excellent condition\n                        - CONTEXT_STATE_REFURBISHED_VERYGOOD - Refurbished - very good condition\n                        - CONTEXT_STATE_REFURBISHED_CORRECT - Refurbished - good condition\n                        - CONTEXT_STATE_REFURBISHED_ACCEPTABLE - Refurbished - acceptable\n                        - CONTEXT_STATE_NEW_OTHERS - New other (see details)\n                        - CONTEXT_STATE_NEW_WITH_DEFECTS - New with defects\n                        - CONTEXT_STATE_NEW_OEM - New - OEM\n                        - CONTEXT_STATE_NEW_OPEN_BOX - New - open box\n                        - CONTEXT_STATE_REFURBISHED_BY_PRODUCER - Renewed by a manufacturer,\n                        - CONTEXT_STATE_REFURBISHED_BY_SELLER - Renewed by a seller,\n                        - CONTEXT_STATE_FOR_PARTS_OR_BROKEN - In parts or damaged.\n                        2. Product weight in grams:\n                        context_id = \"CONTEXT_STD_UNIT_WEIGHT\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        3. A product's value in milliliters:\n                        context_id = \"CONTEXT_STD_UNIT_VOLUME\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        4. Sex:\n                        context_id = \"CONTEXT_SEX\"\n                        Takes values context_value_id:\n                        - CONTEXT_SEX_MAN - Man,\n                        - CONTEXT_SEX_WOMAN - Woman,\n                        - CONTEXT_SEX_UNISEX - Unisex.                        \n                        5. Age group:\n                        context_id = \"CONTEXT_AGE_GROUP\"\n                        Takes values context_value_id:\n                        - CONTEXT_AGE_GROUP_ADULT - Adults,\n                        - CONTEXT_AGE_GROUP_MINOR - Children.\n                        6. Maximum number of products in an order:\n                        context_id = \"CONTEXT_MAX_QUANTITY_PER_RETAIL_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        7. Maximum number of products in a wholesale order:\n                        context_id = \"CONTEXT_MAX_QUANTITY_PER_WHOLESALE_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value. \n                        8. Minimal number of products in an order:\n                        context_id = \"CONTEXT_MIN_QUANTITY_PER_RETAIL_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        9. Minimum number of products in a wholesale order:\n                        context_id = \"CONTEXT_MIN_QUANTITY_PER_WHOLESALE_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        10. Maximal number of a single size in an order:\n                        context_id = \"CONTEXT_MAX_SIZE_QUANTITY_PER_RETAIL_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        11. Maximal number of a single size in a wholesale order:\n                        context_id = \"CONTEXT_MAX_SIZE_QUANTITY_PER_WHOLESALE_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        12. Minimal number of a single size in an order:\n                        context_id = \"CONTEXT_MIN_SIZE_QUANTITY_PER_RETAIL_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        13. Minimal number of a single size in a wholesale order:\n                        context_id = \"CONTEXT_MIN_SIZE_QUANTITY_PER_WHOLESALE_ORDER\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        14. Net weight:\n                        context_id = \"CONTEXT_WEIGHT_NET\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        15. Color:\n                        context_id = \"CONTEXT_COLOR\"\n                        Takes values context_value_id:\n                        - Value of additional feature is set automatically basing on the parameter's value.\n                        16. #!TylkoDlaDoroslych!#:\n                        context_id = \"CONTEXT_ONLY_ADULTS\"\n                        Takes values context_value_id:\n                        - CONTEXT_ONLY_ADULTS_YES - yes,\n                        - CONTEXT_ONLY_ADULTS_NO - no.\n                        17. Prescription drug:\n                        context_id = \"CONTEXT_PRESCRIPTION_MEDICINE\"\n                        Takes values context_value_id:\n                        - CONTEXT_PRESCRIPTION_MEDICINE_YES - yes,\n                        - CONTEXT_PRESCRIPTION_MEDICINE_NO - no.\n                        18. Season Rate:\n                        context_id = \"CONTEXT_SEASON\"\n                        Takes values context_value_id:\n                        - CONTEXT_SEASON_SPRING - Spring,\n                        - CONTEXT_SEASON_SUMMER - Summer,\n                        - CONTEXT_SEASON_FALL - Autumn,\n                        - CONTEXT_SEASON_WINTER - Winter,\n                        - CONTEXT_SEASON_SPRING_SUMMER - Spring/Summer,\n                        - CONTEXT_SEASON_FALL_WINTER - Autumn/Winter                        \n                        19. Risk - signal word:\n                        context_id = \\\"CONTEXT_HAZMAT_SIGNAL\\\"\n                        Takes values context_value_id:\n                        - CONTEXT_HAZMAT_SIGNAL_DANGER - danger,\n                        - CONTEXT_HAZMAT_SIGNAL_WARNING - warnging,\n                        - CONTEXT_HAZMAT_SIGNAL_CAUTION - caution,\n                        - CONTEXT_HAZMAT_SIGNAL_NOTICE - notice,\n                        20. Risk - warning pictogram\n                        context_id = \\\"CONTEXT_HAZMAT_PICTOGRAM\\\"\n                        Takes values context_value_id:\n                        - GHS01, GHS02, GHS03, GHS04, GHS05, GHS06, GHS07, GHS08, GHS09\n                        21. Risk - type of hazard:\n                        context_id = \\\"CONTEXT_HAZMAT_STATEMENT\\\"\n                        Takes values context_value_id:\n                        - H200, H201, H202, H203, H204, H205, H220, H221, H222, H223, H224, H225,\n                        H226, H228, H240, H241, H242, H250, H251, H252, H260, H261, H270, H271, H272,\n                        H280, H281, H290, H300, H301, H302, H304, H310, H311, H312, H314, H315, H317,\n                        H318, H319, H330, H331, H332, H334, H335, H336, H340, H341, H350, H351, H360,\n                        H361, H362, H370, H371, H372, H373, H400, H410, H411, H412, H413,\n                        EUH 001, EUH 014, EUH 018, EUH 019, EUH 044, EUH 029, EUH 031, EUH 032, EUH 066,\n                        EUH 070, EUH 071, EUH 201, EUH 201A, EUH 202, EUH 203, EUH 204, EUH 205, EUH 206,\n                        EUH 207, EUH 208, EUH 209, EUH 209A, EUH 210, EUH 401\n                        22. Repair score:\n                        context_id = \\\"CONTEXT_REPAIR_SCORE\\\"\n                        Takes values context_value_id:\n                        - The value of the additional feature is set automatically based on the parameter's value\n                        23. Safety - information pictogram:\n                        context_id = \\\"CONTEXT_SAFETY_PICTOGRAM\\\"\n                        Takes values context_value_id:\n                        - 1 (Not suitable for small children)\n                        - 2 (CE mark)\n                        24. Safety - type of warning:\n                        context_id = \\\"CONTEXT_SAFETY_STATEMENT\\\"\n                        Takes values context_value_id:\n                        - 1 (Not suitable for children under 3 years)\n                        - 2 (Keep out of the reach of children)\n                        - 3 (Product contains a button cell or coin battery)\n                        - 4 (Use under the direct supervision of adults)\n                        - 5 (Required protective gear. Do not use in public traffic)\n                        - 6 (Contains toy. Adult supervision recommended)\n                        - 7 (To prevent possible injury from entanglement, remove this toy as soon as the child begins to crawl)\n                        - 8 (Use only in shallow water under adult supervision)\n                        - 9 (Only use under adult supervision)\n                        - 10 (This toy does not provide protection)\n                        - 11 (Contains fragrances that may cause allergies)\n                        - 12 (For household use only)." }, "context_value_id": { "type": "string", "description": "value of additional feature - Values described in context_id." } } } }, "settings": { "type": "object", "description": "Settings", "properties": { "icons_input_type": { "type": "string", "description": "", "enum": ["base64", "url"] } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/parameters",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_parameters_search_post", {
    name: "products_parameters_search_post",
    description: `Method that enables adding and editing of sections and parameters, modifying their values and setting their order.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "ids": { "type": "array", "description": "List of identifiers", "items": { "type": "number" } }, "textIds": { "type": "array", "description": "Element text ID - can be entered instead of \"id\".", "items": { "type": "object", "properties": { "languageId": { "type": "string", "description": "Language ID" }, "value": { "type": "string", "description": "Text value" } } } }, "languagesIds": { "type": "array", "description": "List of languages", "items": { "type": "string" } }, "parameterValueIds": { "type": "boolean", "description": "Whether to return a list of parameter value IDs" }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/parameters/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_products_delete_post", {
    name: "products_products_delete_post",
    description: `Method used for deleting products from the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/products/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_products_get", {
    name: "products_products_get",
    description: `Method that enables extracting information about non-deleted products available in the administration panel. 
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "productIds": { "type": "array", "description": "List of the unique, indexed product codes (IAI code / External system code / Producer code). You can transfer a maximum of 100 products IDs in one request.", "items": { "type": "string", "description": "One of the unique, indexed product codes (IAI code / External system code / Producer code). You can transfer a maximum of 100 products IDs in one request." } } } },
    method: "get",
    pathTemplate: "/products/products",
    executionParameters: [{ "name": "productIds", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_products_put", {
    name: "products_products_put",
    description: `Method that enables editing and adding new products to the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "settings": { "type": "object", "description": "Settings", "properties": { "settingModificationType": { "type": "string", "description": "Object determines the products modification mode.\n            Allowed values:\n            \"all\" - (default value). - allows adding new products.\n            If the product of entered ID or external product system code cannot be found in system, the product will be added as a new one.,\n            \"edit\" - doesn't allow adding new products.\n            In this mode only editing the already existing products is possible.\n            If the product of entered ID or external product system code cannot be found in shop, gate will return error and the product will not be added to shop.\n            \"add\" - In this mode you can only add products.", "enum": ["all", "edit", "add"] }, "settingPriceFormat": { "type": "string", "description": "Price format.\n            Parameter is currently unused." }, "settingCalculateBasePriceSizes": { "type": "string", "description": "Element defining the way of calculating product base price basing on prices of sizes. If value is not provided, the base price will be calculated basing on prices of sizes with stock levels. In case of lack of the stock levels, the base price will be calculated basing on prices of all sizes.\n            Allowed values\n            \"all\" - Product price calculated basing on prices of all sizes\n            \"available\" - Product price calculated basing on prices of sizes with stock levels", "enum": ["all", "available"] }, "settingAddingCategoryAllowed": { "type": "string", "description": "Object determines if new categories can be added when category linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - adding new categories not allowed (default value),\n            \"y\" - adding new categories is possible.", "enum": ["n", "y"] }, "settingAddingSizeAllowed": { "type": "string", "description": "Object determines if new product sizes can be added when size linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - adding new sizes not allowed (default value),\n            \"y\" - adding new sizes is possible.", "enum": ["n", "y"] }, "settingAddingProducerAllowed": { "type": "string", "description": "Object determines if new producers can be added when producer linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - you have no rights to add new manufacturers (default value),\n            \"y\" - adding new producer is possible.", "enum": ["n", "y"] }, "settingAddingSeriesAllowed": { "type": "string", "description": "Object determines if new product series can be added when series linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - you have no rights to add new product series (default value),\n            \"y\" - adding new series is possible.", "enum": ["n", "y"] }, "settingAddingSizeschartAllowed": { "type": "string", "description": "Element determines, whether new size charts can be added, when no size chart assigned to sizes is not found in the system.\n            Allowed values:\n            \"n\" - adding new size charts not allowed. (default value),\n            \"y\" - adding new size charts allowed.", "enum": ["n", "y"] }, "settingDefaultCategory": { "type": "object", "description": "Object determines default category which will be linked with product when it will not be linked with any category..", "properties": { "categoryId": { "type": "number", "description": "Category id" }, "categoryName": { "type": "string", "description": "Category name" } } }, "settingDefaultSizesGroup": { "type": "object", "description": "Element specifying the default size group that will be assigned to the new product in case no size group has been explicitly assigned.", "properties": { "sizesGroupId": { "type": "number", "description": "Size group ID\n            Change of one size group to another results in zeroing all stock quantities in all stocks.\n            Change of size group can be made, if product is not present in any unhandled orders nor listed on auctions." }, "sizesGroupName": { "type": "string", "description": "Size group name." } } }, "settingTextIdSeparator": { "type": "string", "description": "Delimiter separating elements of text ID.\n            Default:. \"\\\"." }, "settingIgnoreRetailPricesInCaseOfPromotion": { "type": "string", "description": "Element indicating if retail price in special offer should be ignored.", "enum": ["n", "y"] }, "returnPromotionStatus": { "type": "string", "description": "Element indicating if information about special offer should be retrieved.", "enum": ["n", "y"] }, "settingsRestoreDeletedProducts": { "type": "string", "description": "Element specifying whether the item is to be restored after deletion.", "enum": ["n", "y"] }, "settingsAddingDefaultShopMaskAllowed": { "type": "string", "description": "The item shall determine whether the default visibility in stores can be set if a new commodity is to be created and no parameters have been uploaded to set visibility in at least one store..", "enum": ["n", "y"] }, "settingsAddingManuallySelectedShopMaskAllowed": { "type": "number", "description": "Element specifying whether the default visibility in stores can be set according to the list of stores indicated in the web import source configuration, if a new product will be created and no parameters have been sent to set visibility in at least one store.." }, "settingAddingSupplierAllowed": { "type": "string", "description": "Element specifying whether the system should create a new provider in case of not finding one in the panel.", "enum": ["n", "y"] }, "settingActualizeDelivererMode": { "type": "string", "description": "The element specifies how to update the product supplier\n                Available values:\n                \"always\" - (default value). - update in any case,\n                \"ifNecessary\" - update when no supplier is assigned to the product,\n                \"none\" - supplier update disabled.", "enum": ["always", "ifNecessary", "none"] }, "settingDeleteIndividualDescriptionsByShopsMask": { "type": "object", "description": "Element specifying the mask of stores for which individual names and descriptions are to be removed..", "properties": { "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." } } }, "settingDeleteIndividualMetaByShopsMask": { "type": "object", "description": "Element that specifies the mask of stores for which individual meta updated products are to be removed..", "properties": { "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." } } }, "settingsSkipDuplicatedProducers": { "type": "boolean", "description": "Automatically skip adding manufacturer code and external system code in the product when adding goods if a duplicate code is encountered in other products." } } }, "picturesSettings": { "type": "object", "description": "Icon and photos settings", "properties": { "picturesSettingInitialUrlPart": { "type": "string", "description": "Object determines photo URL." }, "picturesSettingInputType": { "type": "string", "description": "Object determines the method of adding photos in \"pictures\" object.\n            Allowed values\n            \"base64\" - photos added in base64 coding algorithm,\n            \"url\" - photos added as URLs to external systems.", "enum": ["base64", "url"] }, "picturesSettingOverwrite": { "type": "string", "description": "Object determines the method of adding product photos.\n            Allowed values\n            \"n\" - photos are uploaded from the first free place,\n            \"y\" - photos are uploaded from the first place.", "enum": ["n", "y"] }, "picturesSettingDeleteProductPictures": { "type": "string", "description": "Element determining whether or not to delete existing merchandise images.", "enum": ["n", "y"] }, "picturesSettingDeleteProductIcons": { "type": "string", "description": "Element determining whether to delete existing commodity icons.", "enum": ["n", "y"] }, "picturesSettingDeleteIcon": { "type": "string", "description": "Element determining whether to remove the selected icon.", "enum": ["default", "versions", "auctions"] }, "picturesSettingCreateIconFromPicture": { "type": "string", "description": "Element determining whether or not to create icon from the selected photo .", "enum": ["default", "versions", "auctions"] }, "picturesSettingRestoreOriginalPictures": { "type": "string", "description": "Element determining whether to restore existing original images.", "enum": ["n", "y"] }, "picturesSettingRestoreOriginalIcons": { "type": "string", "description": "Element determining the type of icon whose original is to be restored, if any.", "enum": ["default", "versions", "auctions", "all"] }, "picturesSettingApplyMacroForPictures": { "type": "number", "description": "Macro ID to be applied to images on the product." }, "picturesSettingApplyMacroForIcon": { "type": "object", "description": "Macro for the selected icon.", "properties": { "iconType": { "type": "string", "description": "Icon type.", "enum": ["default", "versions", "auctions"] }, "macroId": { "type": "number", "description": "Macro identifier." } } }, "picturesSettingShopId": { "type": "string", "description": "Identifier of the shop for which the action is to be performed." }, "picturesSettingServiceId": { "type": "number", "description": "Identifier of an external service for which the action is to be performed on photos in the goods." }, "picturesSettingScaling": { "type": "string", "description": "Object determines if the photo should be scaled.\n            Allowed values\n            \"n\" - no scaling allowance,\n            \"y\" - scaling allowance.", "enum": ["n", "y"] }, "picturesSettingDeleteOriginalPictures": { "type": "string", "description": "Element determining whether to delete existing original images.", "enum": ["n", "y"] }, "picturesSettingDeleteOriginalIcons": { "type": "string", "description": "Element specifying the type of icon whose original is to be deleted.", "enum": ["default", "versions", "auctions", "all"] }, "picturesSettingRestoreBackupPicturesAndIconsByDateTime": { "type": "string", "description": "" } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productIndex": { "type": "string", "description": "One of the unique, indexed product codes (IAI code / External system code / Producer code)" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "productSizeCodeProducer": { "type": "string", "description": "Producer code for size." }, "productDisplayedCode": { "type": "string", "description": "External product system code." }, "productTaxCode": { "type": "string", "description": "PKWiU [PCPandS]." }, "productInWrapper": { "type": "number", "description": "Number of items in package data" }, "productSellByRetail": { "type": "number", "description": "Sold at - for retailers.", "format": "float" }, "productSellByWholesale": { "type": "number", "description": "Sold at - for wholesalers.", "format": "float" }, "categoryIdoSellId": { "type": "number", "description": "IdoSell Category ID" }, "categoryIdoSellPath": { "type": "string", "description": "IdoSell Category pathname" }, "categoryId": { "type": "number", "description": "Category id" }, "categoryName": { "type": "string", "description": "Category name" }, "producerId": { "type": "number", "description": "Brand ID" }, "producerName": { "type": "string", "description": "Brand name" }, "cnTaricCode": { "type": "string", "description": "CN/TARIC" }, "countryOfOrigin": { "type": "string", "description": "Country of origin. Country code in the ISO 3166-1 A2 standard" }, "unitId": { "type": "number", "description": "Product unit of measure ID." }, "seriesId": { "type": "number", "description": "ID of series, to which product belongs." }, "seriesPanelName": { "type": "string", "description": "Name of series, to which the product belongs, visible in panel." }, "sizesGroupId": { "type": "number", "description": "Size group ID\n            Change of one size group to another results in zeroing all stock quantities in all stocks.\n            Change of size group can be made, if product is not present in any unhandled orders nor listed on auctions." }, "sizesGroupName": { "type": "string", "description": "Size group name." }, "priceChangeMode": { "type": "string", "description": "Optional element, that determines prices edition mode. Default value is \"amount_set\", when indicated element is omitted in API gate call..\n            Allowed values\n            \"amount_set\" - sets product prices to desired value (default mode),\n            \"amount_diff\" - sets sum difference between prices set (adds or subtracts entered sum from the current price),\n            \"percent_diff\" -\n            sets percentage difference between prices set (adds or subtracts entered percent from the current price)." }, "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productRetailPriceNet": { "type": "number", "description": "Net retail price for every shop.", "format": "float" }, "productWholesalePrice": { "type": "number", "description": "Wholesale price", "format": "float" }, "productWholesalePriceNet": { "type": "number", "description": "Net wholesale price for every shop.", "format": "float" }, "productMinimalPrice": { "type": "number", "description": "Minimal price", "format": "float" }, "productMinimalPriceNet": { "type": "number", "description": "Net minimum price for every shop.", "format": "float" }, "productAutomaticCalculationPrice": { "type": "number", "description": "Price for automatic calculations", "format": "float" }, "productAutomaticCalculationPriceNet": { "type": "number", "description": "Price for automatic net calculations for each store", "format": "float" }, "productPosPrice": { "type": "number", "description": "price for POS.", "format": "float" }, "productPosPriceNet": { "type": "number", "description": "price for POS.", "format": "float" }, "productSuggestedPrice": { "type": "number", "description": "Recommended retail price", "format": "float" }, "productSuggestedPriceNet": { "type": "number", "description": "Suggested net commodity price.", "format": "float" }, "productStrikethroughRetailPrice": { "type": "number", "description": "Strikethrough gross retail price", "format": "float" }, "productStrikethroughRetailPriceNet": { "type": "number", "description": "Strikethrough net retail price", "format": "float" }, "productStrikethroughWholesalePrice": { "type": "number", "description": "Strikethrough gross wholesale price", "format": "float" }, "productStrikethroughWholesalePriceNet": { "type": "number", "description": "Strikethrough net wholesale price", "format": "float" }, "productVat": { "type": "number", "description": "Value of VAT", "format": "float" }, "productVatFree": { "type": "string", "description": "Is product VAT free\n            Allowed values\n            \"y\" - yes,\n            \"n\" - no." }, "productPriceComparisonSitesPrices": { "type": "array", "description": "Different prices for price comparison websites.", "items": { "type": "object", "properties": { "priceComparisonSiteId": { "type": "number", "description": "price comparison website ID" }, "productPriceComparisonSitePrice": { "type": "number", "description": "Price for a price comparison website in a shop", "format": "float" }, "productPriceComparisonSitePriceNet": { "type": "number", "description": "Net price for price comparison service in shop", "format": "float" } } } }, "productEnableInPos": { "type": "string", "description": "Object determines if the product is available in POS sale\n            Available values:\n            \"n\" - no,\n            \"y\" - yes." }, "productAdvancePrice": { "type": "number", "description": "Required advance payment in percents", "format": "float" }, "productNote": { "type": "string", "description": "Annotation." }, "productHotspotsZones": { "type": "array", "description": "Settings of hotspots display.", "items": { "type": "object", "properties": { "productHotspotIsEnabled": { "type": "boolean", "description": "Is attribute set" }, "shopId": { "type": "number", "description": "Shop Id" }, "productIsPromotion": { "type": "boolean", "description": "Promotion for shop." }, "productIsDiscount": { "type": "boolean", "description": "Discount for shop." }, "productIsDistinguished": { "type": "boolean", "description": "Distinguished product in store." }, "productIsSpecial": { "type": "boolean", "description": "Special product in store." } } } }, "priceInPoints": { "type": "object", "description": "Loyalty points.", "properties": { "priceInPointsOperation": { "type": "string", "description": "Element determines what kind of operation should be performed.\n            Allowed values:\n            \"clients_cost\" - Clients who are allowed to buy selected products for points,\n            \"clients_award\" - Clients can be awarded with points for buying selected products,\n            \"count_cost\" - Number of points for which the selected products will be sold,\n            \"count_award\" - Number of points clients will be rewarded for buying selected products." }, "shopId": { "type": "number", "description": "Shop Id" }, "priceInPointsPrice": { "type": "number", "description": "Price in points for manual points quantity configuration. Price in points will be calculated on basis of default exchange rates set for indicated store, when this value is 0.", "format": "float" }, "priceInPointsClients": { "type": "string", "description": "Element determines for which customers prices will be changed.\n            Allowed values:\n            \"retailers\" - Prices will be changed for retail customers,\n            \"wholesalers\" - Prices will be changed for wholesale customers,\n            \"both\" - Prices will be changed for both retail and wholesale customers,\n            \"nobody\" - This option is available only for setting determining, which customers can buy for points.\n            Using this value turns off possibility of granting points or buying for points for both retail and wholesale customers." } } }, "loyaltyPoints": { "type": "array", "description": "Loyalty points.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "loyaltyPointsClientsType": { "type": "string", "description": "Customer type.", "enum": ["retailers", "wholesalers", "both"] }, "loyaltyPointsOperation": { "type": "string", "description": "Operation.", "enum": ["disablePoints", "setDefaults", "setPoints"] }, "loyaltyPointsType": { "type": "string", "description": "Loyalty points type.", "enum": ["awardClient", "chargeClient", "both"] }, "numberOfLoyaltyPoints": { "type": "number", "description": "Number of points.", "format": "float" } } } }, "productWeight": { "type": "number", "description": "Weight." }, "productInVisible": { "type": "string", "description": "Product visibility.\n            Allowed values\n            \"y\" - product visible,\n            \"n\" - product not visible." }, "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." }, "productComplexNotes": { "type": "number", "description": "Complex rating\n            Available values:\n            \"0\" - no,\n            \"1\" - yes." }, "productInExportToPriceComparisonSites": { "type": "string", "description": "Product visibility in export to price comparison and marketplaces.\n            Available values:\n            \"y\" - Visible,\n            \"selected\" - Selected,\n            \"assign_selected\" - Enable the visibility of the product in the export to price comparison sites passed in the priceComparisonSites node. Price comparison sites previously assigned to the commodity will be retained,\n            \"unassign_selected\" - Disable product visibility in exports to price comparison sites passed in the priceComparisonSites node,\n            \"n\" - invisible.", "enum": ["y", "selected", "n"] }, "priceComparisonSites": { "type": "array", "description": "Selection of comparison sites for which the product visibility will be changed", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "priceComparisonSiteId": { "type": "number", "description": "price comparison website ID" } } } }, "productInExportToAmazonMarketplace": { "type": "string", "description": "Visibility of an item in an export to Amazon Marketplace.\n            Available values:\n            \"y\" - Visible,\n            \"selected\" - Visible on selected regional services,\n            \"n\" - invisible." }, "exportToAmazonMarketplacesList": { "type": "array", "description": "Array", "items": { "type": "string" } }, "exportToAmazonExportAllSizes": { "type": "string", "description": "Export sizes to Amazon:\n            Available values:\n            \"y\" - all,\n            \"n\" - leave without change.", "enum": ["n", "y"] }, "exportAmazonUpdateStocks": { "type": "string", "description": "Update merchandise inventory, on the Amazon side", "enum": ["n", "y"] }, "productInExportToStrefaMarekAllegro": { "type": "string", "description": "Visibility of product during the import to Strefa Marek Allegro.\n            Allowed values:\n            \"yes\" - product visible in the export to Strefa Marek Allegro,\n            \"no\" - product invisible in the export to Strefa Marek Allegro." }, "productInExportToSmaPreset": { "type": "number", "description": "Profile ID which should be used when sending products to Strefa Marek Allegro." }, "availableProfile": { "type": "number", "description": "Availability profile ID." }, "productRebate": { "type": "number", "description": "Discount profile ID" }, "warrantyId": { "type": "number", "description": "Product warranty ID." }, "warrantyName": { "type": "string", "description": "Name of warranty for indicated product." }, "priceFormula": { "type": "object", "description": "The JavaScript formula calculating prices", "properties": { "priceFormulaParameters": { "type": "string", "description": "Formula parameters for calculating price" }, "priceFormulaFunction": { "type": "string", "description": "Formula function for calculating price" } } }, "sizeChartId": { "type": "number", "description": "Size chart ID" }, "sizeChartName": { "type": "string", "description": "Size chart name" }, "productPriority": { "type": "number", "description": "Priority.\n            Allowed values from 1 to 10." }, "productPriorityInMenuNodes": { "type": "array", "description": "Product priority in menu node.", "items": { "type": "object", "properties": { "productMenuNodeId": { "type": "number", "description": "Menu element ID." }, "productPriority": { "type": "number", "description": "Priority.\n            Allowed values from 1 to 10." }, "shopId": { "type": "number", "description": "Shop Id" }, "productMenuTreeId": { "type": "number", "description": "Tree menu ID." } } } }, "productIconLink": { "type": "string", "description": "Product icon link." }, "productAuctionIconLink": { "type": "string", "description": "Photo without background." }, "productGroupIconLink": { "type": "string", "description": "Icon for a product group." }, "productPictures": { "type": "array", "description": "List of product photos", "items": { "type": "object", "properties": { "productPictureSource": { "type": "string", "description": "A picture in url or base64 (depends on pictures_input_type)." }, "shopId": { "type": "number", "description": "Shop Id" }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } }, "servicesIds": { "type": "array", "description": "External service identifiers", "items": { "type": "number" } } } } }, "productPicturesReplace": { "type": "array", "description": "List of a product's photos with indication of a particular number of the photo.", "items": { "type": "object", "properties": { "productPictureNumber": { "type": "number", "description": "A product photo's number." }, "productPictureSource": { "type": "string", "description": "A picture in url or base64 (depends on pictures_input_type)." } } } }, "productParametersDistinction": { "type": "array", "description": "Parameters (distinguished).", "items": { "type": "object", "properties": { "parameterId": { "type": "number", "description": "Parameter ID" }, "parameterName": { "type": "string", "description": "Parameter name." }, "parameterValueId": { "type": "number", "description": "Parameter value ID" }, "parameterValueName": { "type": "string", "description": "Attributes group name." } } } }, "parametersConfigurable": { "type": "array", "description": "Configuration parameters", "items": { "type": "object", "properties": { "parameterId": { "type": "number", "description": "Parameter ID" }, "priceConfigurableType": { "type": "string", "description": "Parameter type.\n                Available values:\n                \"disable\" - Deletion,\n                \"input\" - Text field,\n                \"radio\" - Single-choice field,\n                \"checkbox\" - Checkbox type multiple choice list,\n                \"select\" - Drop-down single choice list.", "enum": ["disable", "input", "radio", "checkbox", "select"] }, "priceModifierValues": { "type": "array", "description": "Price modifier value", "items": { "type": "object", "properties": { "parameterId": { "type": "number", "description": "Parameter ID" }, "modifierValue": { "type": "number", "description": "" }, "modifierType": { "type": "string", "description": "Available values:\n                \"amount\" - in value,\n                \"percent\" - percentage", "enum": ["amount", "percent"] } } } } } } }, "associatedProducts": { "type": "array", "description": "List of products recommended with this product", "items": { "type": "object", "properties": { "associatedProductId": { "type": "number", "description": "Recommended product ID" }, "associatedProductName": { "type": "string", "description": "Recommended product name" }, "associatedProductCode": { "type": "string", "description": "Recommended product code. External system code." } } } }, "productSizes": { "type": "array", "description": "Sizes available for products data.", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" }, "productWeight": { "type": "number", "description": "Weight." }, "productWeightNet": { "type": "number", "description": "Net weight." }, "productPurchasePriceGrossLast": { "type": "number", "description": "Last gross purchase price", "format": "float" }, "productPurchasePriceNetLast": { "type": "number", "description": "Last net purchase price", "format": "float" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "productStocksData": { "type": "object", "description": "Product stock quantity data.", "properties": { "productStocksQuantities": { "type": "array", "description": "Stocks data", "items": { "type": "object", "properties": { "stockId": { "type": "number", "description": "Stock ID" }, "productSizeQuantity": { "type": "number", "description": "Product stock quantity", "format": "decimal" }, "productSizeQuantityToAdd": { "type": "number", "description": "Product quantity to add up", "format": "decimal" }, "productSizeQuantityToSubstract": { "type": "number", "description": "Product quantity to subtract", "format": "decimal" }, "stockLocationId": { "type": "number", "description": "Warehouse location ID" }, "stockLocationTextId": { "type": "string", "description": "Warehouse location full path" }, "stockLocationCode": { "type": "string", "description": "Storage location code" }, "stockAdditionalLocations": { "type": "array", "description": "Additional locations", "items": { "type": "object", "properties": { "stockAdditionalLocationSettings": { "type": "string", "description": "Element specifying the modification mode for additional locations.\n                Available values:\n                \"add\" - assignment of additional product location,\n                \"remove\" - Remove the assignment of an additional location to the product.", "enum": ["add", "remove"] }, "stockAdditionalLocationId": { "type": "number", "description": "Warehouse location ID" }, "stockAdditionalLocationTextId": { "type": "string", "description": "Warehouse location full path" }, "stockAdditionalLocationCode": { "type": "string", "description": "Storage location code" } } } } } } } } }, "productSizeCodeProducer": { "type": "string", "description": "Producer code for size." }, "productSizeCodeDeliverer": { "type": "string", "description": "Supplier code" } } } }, "attachments": { "type": "array", "description": "Product attachments list.", "items": { "type": "object", "properties": { "attachmentUrl": { "type": "string", "description": "Attachment file link." }, "attachmentName": { "type": "object", "description": "Attachment name.", "properties": { "attachmentLanguages": { "type": "array", "description": "List of languages.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "langValue": { "type": "string", "description": "Literal in selected language." } } } } } }, "attachmentFileType": { "type": "string", "description": "File type: audio, video, doc, other.", "enum": ["audio", "video", "doc", "other", "image"] }, "attachmentEnable": { "type": "string", "description": "Type of customer, attachment should be available for: 'all','ordered','wholesaler','wholesaler_or_ordered','wholesaler_and_ordered'.", "enum": ["all", "only_logged", "ordered", "wholesaler", "wholesaler_or_orderer", "wholesaler_and_ordered"] }, "attachmentId": { "type": "number", "description": "Attachment ID." }, "attachmentDownloadLog": { "type": "string", "description": "Attachment downloads record.", "enum": ["y", "n"] }, "attachmentFileExtension": { "type": "string", "description": "Attachment file extension." }, "attachmentPriority": { "type": "number", "description": "Attachment number." }, "documentTypes": { "type": "array", "description": "Attachment document types list.", "items": { "type": "object", "properties": { "documentType": { "type": "string", "description": "Document type.", "enum": ["energy_label", "instruction_with_safety_information", "user_manual", "installation_instructions", "product_card", "guide", "others"] }, "description": { "type": "string", "description": "Additional description." } } } } } } }, "removeAttachments": { "type": "array", "description": "The list of attachments to be deleted.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" } } } }, "virtualAttachmentsToRemove": { "type": "boolean", "description": "Do you want to delete attachments for digital files." }, "virtualAttachments": { "type": "array", "description": "List of product's virtual attachments.", "items": { "type": "object", "properties": { "attachmentUrl": { "type": "string", "description": "Attachment file link." }, "attachmentName": { "type": "object", "description": "Attachment name.", "properties": { "attachmentLanguages": { "type": "array", "description": "List of languages.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "langValue": { "type": "string", "description": "Literal in selected language." } } } } } }, "attachmentType": { "type": "string", "description": "Full version or sample.", "enum": ["full", "demo"] }, "attachmentLimits": { "type": "object", "description": "Number of attachment downloads limit.", "properties": { "arrachmentDownloadsLimit": { "type": "number", "description": "Number of downloads limit." }, "arrachmentDaysLimit": { "type": "number", "description": "Number of days file should be available." } } }, "attachmentId": { "type": "number", "description": "Attachment ID." }, "attachmentPriority": { "type": "number", "description": "Attachment number." } } } }, "attachmentOperationValues": { "type": "string", "description": "Operation, that will be performed on attachments to product.", "enum": ["edit", "add", "remove"] }, "productShopsAttributes": { "type": "array", "description": "Data concerning attributes dependent on indicated stores with particular product assigned.", "items": { "type": "object", "properties": { "shopInVisible": { "type": "string", "description": "Product visibility in store.", "enum": ["y", "n"] }, "shopId": { "type": "number", "description": "Shop Id" }, "productAuctionsPrices": { "type": "array", "description": "Prices for marketplaces", "items": { "type": "object", "properties": { "auctionId": { "type": "number", "description": "Auction site ID" }, "auctionPrice": { "type": "number", "description": "Cost price.", "format": "float" }, "auctionSiteId": { "type": "number", "description": "Auction site page ID" }, "sizeId": { "type": "string", "description": "Size identifier" }, "auctionStartPrice": { "type": "number", "description": "Auction starting price", "format": "float" }, "auctionStartPriceNet": { "type": "number", "description": "Auction starting price net", "format": "float" }, "auctionBuyNowPrice": { "type": "number", "description": "\"Buy It Now\" price", "format": "float" }, "auctionBuyNowPriceNet": { "type": "number", "description": "Kup Teraz price net.", "format": "float" }, "auctionMinimalPrice": { "type": "number", "description": "Minimal price", "format": "float" }, "auctionMinimalPriceNet": { "type": "number", "description": "Minimal net price", "format": "float" }, "currencyId": { "type": "string", "description": "Currency ID" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "sizePanelName": { "type": "string", "description": "Size name" } } } }, "shopPriceComparersPrices": { "type": "array", "description": "", "items": { "type": "object", "properties": { "priceComparisonSiteId": { "type": "number", "description": "price comparison website ID" }, "productPriceComparisonSitePrice": { "type": "number", "description": "Price for a price comparison website in a shop", "format": "float" }, "productPriceComparisonSitePriceNet": { "type": "number", "description": "Net price for price comparison service in shop", "format": "float" }, "productPriceComparisonSitePercentDiff": { "type": "number", "description": "Percentage difference between the price comparison website and the shop", "format": "float" }, "priceRoundMode": { "type": "string", "description": "Forced rounding up method.", "enum": ["none", "00", "x0", "99", "x9"] } } } }, "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productRetailPriceNet": { "type": "number", "description": "Net retail price for every shop.", "format": "float" }, "productWholesalePrice": { "type": "number", "description": "Wholesale price", "format": "float" }, "productWholesalePriceNet": { "type": "number", "description": "Net wholesale price for every shop.", "format": "float" }, "productMinimalPrice": { "type": "number", "description": "Minimal price", "format": "float" }, "productMinimalPriceNet": { "type": "number", "description": "Net minimum price for every shop.", "format": "float" }, "productPricesConfig": { "type": "string", "description": "Price settings, possible values:\n            \"wholesale_equals_retail\" - Wholesale price same as retail price,\n            \"wholesale_notequals_retail\" - Wholesale price different than retail price,\n            \"all_prices_equals_zero\" - All prices request a quote by phone,\n            \"retail_price_equals_zero\" - Retail price on call,\n            \"default_prices\" - default prices,\n            \"retail_equals_suggested\" - Retail price is the same as recommended one,\n            \"automatically_calculated\" - Price calculated automatically.", "enum": ["default_prices", "wholesale_equals_retail", "wholesale_notequals_retail", "all_prices_equals_zero", "retail_price_equals_zero", "retail_equals_suggested", "automatically_calculated", "sizes_price_as_base_price"] }, "productSuggestedPrice": { "type": "number", "description": "Recommended retail price", "format": "float" }, "productSuggestedPriceNet": { "type": "number", "description": "Suggested net commodity price.", "format": "float" }, "productStrikethroughRetailPrice": { "type": "number", "description": "Strikethrough gross retail price", "format": "float" }, "productStrikethroughRetailPriceNet": { "type": "number", "description": "Strikethrough net retail price", "format": "float" }, "productStrikethroughWholesalePrice": { "type": "number", "description": "Strikethrough gross wholesale price", "format": "float" }, "productStrikethroughWholesalePriceNet": { "type": "number", "description": "Strikethrough net wholesale price", "format": "float" }, "productConfigPricesDefaultShop": { "type": "number", "description": "Configuration details for setting of parameter  prices_config=default_prices." }, "priceRoundMode": { "type": "string", "description": "Forced rounding up method.", "enum": ["none", "00", "x0", "99", "x9"] }, "productPricesConfigAutomatonDetails": { "type": "array", "description": "Configuration details for setting of parameter  prices_config=automatically_calculated.", "items": { "type": "object", "properties": { "priceAutomatonPriceName": { "type": "string", "description": "Price name, one of values: retail, wholsale, minimal.", "enum": ["retail", "wholesale", "minimal", "automatic_calculation"] }, "priceAutomatonPriceSettings": { "type": "string", "description": "Price setting, one of values: own, last_purchased, avarage_purchased, retail, wholsale,\n            minimal", "enum": ["own", "last_purchased", "avarage_purchased", "retail", "wholesale", "minimal", "automatic_calculation"] }, "priceAutomatonPriceType": { "type": "string", "description": "Price type, one of values: gross, net", "enum": ["gross", "net"] }, "priceAutomatonPriceValue": { "type": "number", "description": "Final amount", "format": "float" }, "priceAutomatonPriceCurrencyId": { "type": "string", "description": "Final amount currency" }, "priceAutomatonPriceShop": { "type": "number", "description": "shop ID from which price is retrieved" }, "priceAutomatonMarginCurrencyValue": { "type": "number", "description": "Amount margin", "format": "float" }, "priceAutomatonMarginCurrencyId": { "type": "string", "description": "Amount margin currency" }, "priceAutomatonMarginPercentValue": { "type": "number", "description": "Percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalValue": { "type": "number", "description": "Minimal value of percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalCurrencyId": { "type": "string", "description": "Minimal value of percentage margin currency" }, "priceAutomatonPriceMinimalValue": { "type": "number", "description": "Minimal amount with margins reflected", "format": "float" }, "priceAutomatonPriceMinimalCurrencyId": { "type": "string", "description": "Minimal amount currency" }, "priceAutomatonDecimalRoundValue": { "type": "string", "description": "Decimal complement should contain 0 to 2 digits. If it contains 0 digits, the system will calculate the amount with precision of up to 2 decimal places. If it contains 2 digits, the system will calculate the amount with precision of the total number and will add the value of this field as a decimal part of this amount" } } } }, "productAuctions": { "type": "array", "description": "Parameters set for auction sites", "items": { "type": "object", "properties": { "auctionId": { "type": "number", "description": "Auction site ID" }, "auctionSiteId": { "type": "number", "description": "Auction site page ID" }, "auctionPricesConfig": { "type": "string", "description": "Price settings, possible values: \"manual\" - Price entered manually,\n            \"automatically_calculated\" - Price calculated automatically.", "enum": ["manual", "automatically_calculated"] }, "auctionPricesConfigAutomatonDetails": { "type": "array", "description": "Configuration details for setting of parameter  prices_config=automatically_calculated", "items": { "type": "object", "properties": { "auctionPriceAutomatonPriceName": { "type": "string", "description": "Price name, one of values: buy_now, start, minimal_auction", "enum": ["buy_now", "start", "minimal_auction"] }, "auctionPriceAutomatonPriceSettings": { "type": "string", "description": "Price setting, one of values: own, last_purchased, avarage_purchased, retail, wholsale,\n            minimal, buy_now, start, minimal_auction.", "enum": ["own", "last_purchased", "avarage_purchased", "retail", "wholesale", "minimal", "automatic_calculation", "buy_now", "start", "minimal_auction"] }, "priceAutomatonPriceType": { "type": "string", "description": "Price type, one of values: gross, net", "enum": ["gross", "net"] }, "priceAutomatonPriceValue": { "type": "number", "description": "Final amount", "format": "float" }, "priceAutomatonPriceCurrencyId": { "type": "string", "description": "Final amount currency" }, "priceAutomatonPriceShop": { "type": "number", "description": "shop ID from which price is retrieved" }, "priceAutomatonMarginCurrencyValue": { "type": "number", "description": "Amount margin", "format": "float" }, "priceAutomatonMarginCurrencyId": { "type": "string", "description": "Amount margin currency" }, "priceAutomatonMarginPercentValue": { "type": "number", "description": "Percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalValue": { "type": "number", "description": "Minimal value of percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalCurrencyId": { "type": "string", "description": "Minimal value of percentage margin currency" }, "priceAutomatonPriceMinimalValue": { "type": "number", "description": "Minimal amount with margins reflected", "format": "float" }, "priceAutomatonPriceMinimalCurrencyId": { "type": "string", "description": "Minimal amount currency" }, "priceAutomatonDecimalRoundValue": { "type": "string", "description": "Decimal complement should contain 0 to 2 digits. If it contains 0 digits, the system will calculate the amount with precision of up to 2 decimal places. If it contains 2 digits, the system will calculate the amount with precision of the total number and will add the value of this field as a decimal part of this amount" } } } }, "productAuctionsSizes": { "type": "array", "description": "Parameters for sizes", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" }, "auctionPricesConfigAutomatonDetails": { "type": "array", "description": "Configuration details for setting of parameter  prices_config=automatically_calculated", "items": { "type": "object", "properties": { "auctionPriceAutomatonPriceName": { "type": "string", "description": "Price name, one of values: buy_now, start, minimal_auction", "enum": ["buy_now", "start", "minimal_auction"] }, "auctionPriceAutomatonPriceSettings": { "type": "string", "description": "Price setting, one of values: own, last_purchased, avarage_purchased, retail, wholsale,\n            minimal, buy_now, start, minimal_auction.", "enum": ["own", "last_purchased", "avarage_purchased", "retail", "wholesale", "minimal", "buy_now", "start", "minimal_auction", "automatic_calculation"] }, "priceAutomatonPriceType": { "type": "string", "description": "Price type, one of values: gross, net", "enum": ["gross", "net"] }, "priceAutomatonPriceValue": { "type": "number", "description": "Final amount", "format": "float" }, "priceAutomatonPriceCurrencyId": { "type": "string", "description": "Final amount currency" }, "priceAutomatonPriceShop": { "type": "number", "description": "shop ID from which price is retrieved" }, "priceAutomatonMarginCurrencyValue": { "type": "number", "description": "Amount margin", "format": "float" }, "priceAutomatonMarginCurrencyId": { "type": "string", "description": "Amount margin currency" }, "priceAutomatonMarginPercentValue": { "type": "number", "description": "Percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalValue": { "type": "number", "description": "Minimal value of percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalCurrencyId": { "type": "string", "description": "Minimal value of percentage margin currency" }, "priceAutomatonPriceMinimalValue": { "type": "number", "description": "Minimal amount with margins reflected", "format": "float" }, "priceAutomatonPriceMinimalCurrencyId": { "type": "string", "description": "Minimal amount currency" }, "priceAutomatonDecimalRoundValue": { "type": "string", "description": "Decimal complement should contain 0 to 2 digits. If it contains 0 digits, the system will calculate the amount with precision of up to 2 decimal places. If it contains 2 digits, the system will calculate the amount with precision of the total number and will add the value of this field as a decimal part of this amount" } } } } } } } } } }, "setTheSamePriceForAuctionAsInStore": { "type": "boolean", "description": "Set the same price for auction sites as in store." }, "productShopPriceComparisonSites": { "type": "array", "description": "Parameters set for price comparison websites", "items": { "type": "object", "properties": { "priceComparisonSiteId": { "type": "number", "description": "price comparison website ID" }, "priceComparisonSiteName": { "type": "string", "description": "price comparison website name" }, "priceComparisonSitePricesConfig": { "type": "string", "description": "Price settings, possible values: \"manual\" - Price entered manually,\n            \"automatically_calculated\" - Price calculated automatically.", "enum": ["manual", "automatically_calculated"] }, "priceComparisonSitePriceConfigAutomatonDetails": { "type": "object", "description": "Configuration details for setting of parameter  prices_config=automatically_calculated", "properties": { "priceAutomatonPriceSettings": { "type": "string", "description": "Price setting, one of values: own, last_purchased, avarage_purchased, retail, wholsale,\n            minimal", "enum": ["own", "last_purchased", "avarage_purchased", "retail", "wholesale", "minimal"] }, "priceAutomatonPriceType": { "type": "string", "description": "Price type, one of values: gross, net", "enum": ["gross", "net"] }, "priceAutomatonPriceValue": { "type": "number", "description": "Final amount", "format": "float" }, "priceAutomatonPriceCurrencyId": { "type": "string", "description": "Final amount currency" }, "priceAutomatonPriceShop": { "type": "number", "description": "shop ID from which price is retrieved" }, "priceAutomatonMarginCurrencyValue": { "type": "number", "description": "Amount margin", "format": "float" }, "priceAutomatonMarginCurrencyId": { "type": "string", "description": "Amount margin currency" }, "priceAutomatonMarginPercentValue": { "type": "number", "description": "Percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalValue": { "type": "number", "description": "Minimal value of percentage margin", "format": "float" }, "priceAutomatonPricePercentMinimalCurrencyId": { "type": "string", "description": "Minimal value of percentage margin currency" }, "priceAutomatonPriceMinimalValue": { "type": "number", "description": "Minimal amount with margins reflected", "format": "float" }, "priceAutomatonPriceMinimalCurrencyId": { "type": "string", "description": "Minimal amount currency" }, "priceAutomatonDecimalRoundValue": { "type": "string", "description": "Decimal complement should contain 0 to 2 digits. If it contains 0 digits, the system will calculate the amount with precision of up to 2 decimal places. If it contains 2 digits, the system will calculate the amount with precision of the total number and will add the value of this field as a decimal part of this amount" } } } } } } } } }, "subscription": { "type": "array", "description": "Products subscription settings.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "enabled": { "type": "boolean", "description": "Is subscription enabled for product" }, "daysInPeriod": { "type": "array", "description": "Days in period", "items": { "type": "number" } }, "unitsNumberRetail": { "type": "number", "description": "Sold at - for retailers.", "format": "float" }, "unitsNumberWholesale": { "type": "number", "description": "Sold at - for wholesalers.", "format": "float" } } } }, "productNames": { "type": "object", "description": "Product name.", "properties": { "productNamesLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productName": { "type": "string", "description": "Product name." }, "shopId": { "type": "number", "description": "Shop Id" }, "serviceId": { "type": "number", "description": "External service identifier" } } } } } }, "productNamesInAuction": { "type": "object", "description": "DEPRECATED. This parameter is deprecated. Product name for online auctions.", "properties": { "productNamesInAuctionLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productNameInAuction": { "type": "string", "description": "" } } } } } }, "productNamesInPriceComparer": { "type": "object", "description": "Product name for price comparison websites.", "properties": { "productNamesInPriceComparerLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productNameInPriceComparer": { "type": "string", "description": "Product name for price comparison websites." } } } } } }, "productParamDescriptions": { "type": "object", "description": "Product short description", "properties": { "productParamDescriptionsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productParamDescriptions": { "type": "string", "description": "Product short description" }, "shopId": { "type": "number", "description": "Shop Id" }, "serviceId": { "type": "number", "description": "External service identifier" } } } } } }, "productLongDescriptions": { "type": "object", "description": "Long product description", "properties": { "productLongDescriptionsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productLongDescription": { "type": "string", "description": "Long product description." }, "shopId": { "type": "number", "description": "Shop Id" }, "serviceId": { "type": "number", "description": "External service identifier" } } } } } }, "productLongDescriptionsInAuction": { "type": "object", "description": "DEPRECATED. This parameter is deprecated. Product description for marketplaces.", "properties": { "productLongDescriptionsInAuctionLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productLongDescriptionInAuction": { "type": "string", "description": "" } } } } } }, "productAuctionDescriptionsData": { "type": "array", "description": "Product data for auction services", "items": { "type": "object", "properties": { "productAuctionId": { "type": "string", "description": "Auction system ID" }, "productAuctionSiteId": { "type": "string", "description": "Auction site ID" }, "productAuctionName": { "type": "string", "description": "Product name for auction service." }, "productAuctionAdditionalName": { "type": "string", "description": "Subtitle for auction service " }, "productAuctionDescription": { "type": "string", "description": "Product description for marketplaces" } } } }, "productMetaTitles": { "type": "object", "description": "Product meta title", "properties": { "productMetaTitlesLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "productMetaTitle": { "type": "string", "description": "Product meta title." } } } } } }, "productMetaDescriptions": { "type": "object", "description": "Product meta description", "properties": { "productMetaDescriptionsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "productMetaDescription": { "type": "string", "description": "Product meta description." } } } } } }, "productMetaKeywords": { "type": "object", "description": "Product meta keywords.", "properties": { "productMetaKeywordsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "productMetaKeyword": { "type": "string", "description": "Product meta keywords." } } } } } }, "productUrl": { "type": "object", "description": "URL for the product", "properties": { "productUrlsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "langId": { "type": "string", "description": "Language ID" }, "url": { "type": "string", "description": "" } } } } } }, "productVersion": { "type": "object", "description": "Data on product groups (variants)", "properties": { "versionParent": { "type": "object", "description": "ID of the main item (variant) in the group.", "properties": { "versionParentId": { "type": "string", "description": "Value." }, "versionParentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "codeExtern", "codeProducer"] } } }, "versionPriority": { "type": "number", "description": "The order of products in the group. Value needs to be more than 0." }, "versionSettings": { "type": "object", "description": "Settings for groups of items (variants)", "properties": { "versionDisplayAllInShop": { "type": "string", "description": "Show in shop.\n            Available values:\n            \"y\" - all products from group,\n            \"n\" - only the first product from group." }, "versionDisplayAllInPanel": { "type": "string", "description": "Show in panel.\n            Available values:\n            \"y\" - wszystkie towary z grupy,\n            \"n\" - only the first product from group." }, "versionDisplayRelCanonicalInShop": { "type": "string", "description": "Adding the canonical links to the site.\n            Available values:\n            \"y\" - on,\n            \"n\" - Off." }, "versionCommonCode": { "type": "string", "description": "The same code.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonProducer": { "type": "string", "description": "The same brand.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonNote": { "type": "string", "description": "The same annotation.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonWarranty": { "type": "string", "description": "The same warranty.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSizesChart": { "type": "string", "description": "The same for size chart.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSeries": { "type": "string", "description": "The same series.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonCategory": { "type": "string", "description": "The same category.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPrice": { "type": "string", "description": "The same price.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAdvance": { "type": "string", "description": "Same advance.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonRebate": { "type": "string", "description": "Same quantity discount.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonVat": { "type": "string", "description": "the same VAT rate.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonProfitPoints": { "type": "string", "description": "The same loyalty points.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAssociated": { "type": "string", "description": "The same related product.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonVisibility": { "type": "string", "description": "The same visibility.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPriority": { "type": "string", "description": "The same priority.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonShops": { "type": "string", "description": "The same shops.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSizes": { "type": "string", "description": "The same sizes.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonWeight": { "type": "string", "description": "The same weight.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonName": { "type": "string", "description": "The same name.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAuctionName": { "type": "string", "description": "The same product's name for Internet auctions.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonDescription": { "type": "string", "description": "The same short description.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonLongDescription": { "type": "string", "description": "The same long description.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonIcon": { "type": "string", "description": "The same icon.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPhotos": { "type": "string", "description": "The same large photos.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAvailableProfile": { "type": "string", "description": "The same availability profile.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonComplexNotes": { "type": "string", "description": "The same complex rating.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSumInBasket": { "type": "string", "description": "Do You wish to sum up the products in the basket as a one order?\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonMenuItems": { "type": "string", "description": "The same objects in menu\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonDeliverer": { "type": "string", "description": "The same supplier.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAttachments": { "type": "string", "description": "The same attachments\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAuctionIcon": { "type": "string", "description": "The same icons for auctions\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSerialNumbers": { "type": "string", "description": "The same serial numbers\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonDictionary": { "type": "string", "description": "The same parameters.\n            possible values\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPromotions": { "type": "string", "description": "Same promotions\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonMetaTags": { "type": "string", "description": "The same meta settings\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonCurrency": { "type": "string", "description": "The same currency.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPriceFormula": { "type": "string", "description": "The same formula for calculating prices\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonJavaScriptOnCard": { "type": "string", "description": "The same JavaScript displayed on the product card\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." } } }, "versionNames": { "type": "object", "description": "Parameter value names", "properties": { "versionNamesLangData": { "type": "array", "description": "Array of languages, values are displayed in.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "versionName": { "type": "string", "description": "Name of the parameter value, e.g. orange, green, red" } } } } } }, "versionGroupNames": { "type": "object", "description": "Parameter names", "properties": { "versionGroupNamesLangData": { "type": "array", "description": "Parameter name", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "versionGroupName": { "type": "string", "description": "Parameter name, e.g. color, width" } } } } } } } }, "currencyId": { "type": "string", "description": "Currency ID" }, "productCurrenciesShops": { "type": "array", "description": "Currency, in which product prices are stored.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "currencyId": { "type": "string", "description": "Currency ID" } } } }, "delivererId": { "type": "number", "description": "Supplier ID." }, "delivererName": { "type": "string", "description": "Supplier name." }, "productParametersDistinctionChangeMode": { "type": "string", "description": "This parameter is optional and it determines properties edition mode.\n            Default value is \"replace\".\n            Allowed values:\n            \"add\" - adds properties to already existent ones,\n            \"delete\" - removes properties of already existent ones,\n            \"delete_group\" - removes properties from selected group,\n            \"replace\" - overwrites properties already existent with new ones (default mode).", "enum": ["add", "delete", "delete_group", "replace"] }, "productDeliveryTime": { "type": "object", "description": "Product delivery time from the producer to the shop", "properties": { "productDeliveryTimeChangeMode": { "type": "string", "description": "Operation type:\n            \"product\" - sets own product delivery time,\n            \"deliverer\" - sets product delivery time exactly the same as deliverer's.", "enum": ["product", "deliverer"] }, "productDeliveryTimeValue": { "type": "number", "description": "The amount of time it takes to get goods from the supplier to the store. The maximum time is 99 for the unit \"days\" or 999 for the unit \"hours\" and \"minutes\"" }, "productDeliveryTimeType": { "type": "string", "description": "Determine the type of time it takes to get goods from supplier to store", "enum": ["immediately", "minutes", "hours", "upTo24h", "workingDays", "notKnown"] } } }, "productParameters": { "type": "array", "description": "Parameters.", "items": { "type": "object", "properties": { "productParameterOperation": { "type": "string", "description": "\"add_parameter\" - assigning element to product,\n            \"delete_parameter\" - removing element from product.", "enum": ["add_parameter", "delete_parameter"] }, "productParameterId": { "type": "number", "description": "Parameter ID" }, "productParameterPriority": { "type": "number", "description": "Determines where the parameter will be added. If no value is specified, the parameter will be placed at the end of the list. If a value of e.g. 5 is set, the value of all priorities >= 5 will be increased by 1 to provide a unique priority value." }, "productParameterTextIdsLangData": { "type": "array", "description": "Allows to enter parameter name i multiple languages at the same time. If it is used, item_textid and lang_id are ingored.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productParameterTextId": { "type": "string", "description": "Parameter ID." } } } }, "langId": { "type": "string", "description": "Language ID" }, "productParametersDescriptionsLangData": { "type": "array", "description": "Parameters descriptions in indicated language versions.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productParametersDescription": { "type": "string", "description": "Parameter description" } } } } } } }, "clearProductParameters": { "type": "boolean", "description": "" }, "changeParametersDistinction": { "type": "array", "description": "Change parameter distinction.", "items": { "type": "object", "properties": { "productParameterId": { "type": "number", "description": "Parameter ID" }, "productParameterTextIdent": { "type": "string", "description": "Parameter name (if ID was not used)." }, "langId": { "type": "string", "description": "Language ID" }, "productParameterDescriptionType": { "type": "string", "description": "Available values:\n            distinction - Set as distinguished on product card, list of products (distinguished),\n            projector_hide - Set as hidden on list of parameters on product card,\n            group_distinction - Set as parameter differentiating products in group  (nieaktywne),\n            auction_template_hide - Hidden for a variable [iai:product_parameters] in auction templates .", "enum": ["distinction", "group_distinction", "projector_hide", "auction_template_hide"] }, "parameterDistinctionValue": { "type": "string", "description": "Value. Allowed values: \"y\" \"n\"", "enum": ["y", "n"] } } } }, "productPriceVatChangeMode": { "type": "string", "description": "VAT rate change mode:.\n            \"change_gross\" - changes the product gross price, leaving the net price unchanged,\n            \"change_net\" - changes the net price, leaving the gross price unchanged (default mode).", "enum": ["change_net", "change_gross"] }, "productMenuItems": { "type": "array", "description": "An array of menu elements", "items": { "type": "object", "properties": { "productMenuOperation": { "type": "string", "description": "Menu element operation type. Available values.\n            - add_product - assigns a product to the menu element.\n            - delete_product - removes a product from the menu element.", "enum": ["add_product", "delete_product"] }, "menuItemId": { "type": "number", "description": "ID of the menu node to which the product is to be assigned" }, "menuItemTextId": { "type": "string", "description": "Menu element text identifier.\n            Example: \"item1\\item2\\item3\"." }, "shopId": { "type": "number", "description": "Shop Id" }, "menuId": { "type": "number", "description": "ID of the menu zone displayed in the mask" } } } }, "removeAllProductsAssignedToMenu": { "type": "object", "description": "Deletes all items assigned to the product of the selected menu", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "menuId": { "type": "number", "description": "ID of the menu zone displayed in the mask" } } }, "productSumInBasket": { "type": "string", "description": "Do You wish to sum up the products in the basket as a one order?\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "productShopsPricesConfig": { "type": "string", "description": "Settings of prices for shop. Values allowed:\n            \"same_prices\" - prices in each shop are the same,\n            \"different_prices\" - prices in each shop are different.", "enum": ["same_prices", "different_prices"] }, "productPosPricesConfig": { "type": "string", "description": "Price settings for POS. Allowed values:\n            \"pos_equals_retail\" - sets POS price the same as retail price. Possible to set only if the \"shops_prices_config\" parameter is set to jest same_prices or there is only one shop in panel,\n            \"pos_notequals_retail\" - Price for POS different than retail price,\n            \"not_available_in_pos\" - Product not available for POS sales.\n            \"sizes_pos_price_as_base_price\" - Remove prices for sizes and set a sale price which equals a basic price.", "enum": ["pos_equals_retail", "pos_notequals_retail", "not_available_in_pos", "sizes_pos_price_as_base_price"] }, "productType": { "type": "string", "description": "Product type. Allowed values:\n            \"product_item\" - Goods,\n            \"product_free\" - Free product,\n            \"product_packaging\" - packaging,\n            \"product_bundle\" - set.\n            \"product_collection\" - collection.\n            \"product_service\" - service.\n            \"product_virtual\" - virtual product.\n            \"product_configurable\" - configurable product.", "enum": ["product_item", "product_free", "product_packaging", "product_bundle", "product_collection", "product_virtual", "product_service", "product_configurable"] }, "priceRoundMode": { "type": "string", "description": "Forced rounding up method.", "enum": ["none", "00", "x0", "99", "x9"] }, "productAvailabilityManagementType": { "type": "string", "description": "Product availability management method\n            Available values:\n            \"stock\" - by means of stock management tools,\n            \"manual\" - manually.", "enum": ["manual", "stock"] }, "removeChooseSizesValues": { "type": "array", "description": "List of unused sizes in product to be deleted", "items": { "type": "string" } }, "removeAllUnusedProductSizes": { "type": "boolean", "description": "Remove all unused sizes." }, "producerCodesStandard": { "type": "string", "description": "Standard producer code.\n            Available values:\n            \"auto\" - Choose automatically,\n            \"GTIN14\" - GTIN-14\n            \"GTIN13\" - GTIN-13 (EAN-13)\n            \"ISBN13\" - GTIN-13 (ISBN-13)\n            \"GTIN12\" - GTIN-12 (UPC-A)\n            \"ISBN10\" - ISBN-10\n            \"GTIN8\" - GTIN-8 (EAN-8)\n            \"UPCE\" - UPC-E\n            \"MPN\" - MPN\n            \"other\" - Other", "enum": ["auto", "GTIN14", "GTIN13", "ISBN13", "GTIN12", "ISBN10", "GTIN8", "UPCE", "MPN", "other"] }, "javaScriptInTheItemCard": { "type": "array", "description": "JavaScript code displayed in the product page of the IdoSell Shop", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "scriptCode": { "type": "string", "description": "JavaScript code displayed in the product page of the IdoSell Shop" } } } }, "serialNumbersOption": { "type": "string", "description": "Saving serial numbers\n                Available values:\n                \"na\" - not used,\n                \"optional\" - Optional,\n                \"required\" - required.", "enum": ["na", "optional", "required"] }, "dispatchSettings": { "type": "object", "description": "Shipping, returns and complaints settings", "properties": { "enabled": { "type": "boolean", "description": "" }, "shippingSettings": { "type": "object", "description": "Shipping settings", "properties": { "codDisabled": { "type": "boolean", "description": "Disable cash on delivery orders" }, "dvpOnly": { "type": "boolean", "description": "Only personal collection" }, "atypicalSize": { "type": "boolean", "description": "Oversized product" }, "insuranceOnly": { "type": "boolean", "description": "Insurance required" }, "excludeSmileService": { "type": "boolean", "description": "Exclusion from the Smile service" }, "disallowedCouriers": { "type": "array", "description": "List of courier services which cannot be used to ship this product", "items": { "type": "number" } } } }, "freeShippingSettings": { "type": "object", "description": "Free shipping settings", "properties": { "mode": { "type": "string", "description": "Edition mode", "enum": ["no", "onlyProduct", "wholeBasket"] }, "availablePaymentForms": { "type": "object", "description": "Set free shipping for the payment method only .", "properties": { "prepaid": { "type": "boolean", "description": "prepayment" }, "cashOnDelivery": { "type": "boolean", "description": "Cash on delivery" }, "tradeCredit": { "type": "boolean", "description": "Trade credit" } } }, "availableCouriers": { "type": "array", "description": "List of courier services for which shipping is free", "items": { "type": "number" } }, "availableCouriersForSingleProduct": { "type": "array", "description": "List of courier services by which the products can be sent free of charge. IDs couriers", "items": { "type": "number" } }, "availableRegions": { "type": "array", "description": "List of regions with free shipment", "items": { "type": "number" } } } }, "returnProductSettings": { "type": "object", "description": "Return and complaint settings", "properties": { "returnOptions": { "type": "object", "description": "Product can be returned", "properties": { "enabled": { "type": "boolean", "description": "" }, "firm": { "type": "boolean", "description": "yes - for companies" }, "hurt": { "type": "boolean", "description": "yes - for wholesalers" }, "detalist": { "type": "boolean", "description": "yes - for retailers" } } }, "byOwnService": { "type": "boolean", "description": "" }, "byInPostSzybkieZwrotyByIAI": { "type": "boolean", "description": "" } } } } }, "standardUnit": { "type": "object", "description": "Standard unit settings", "properties": { "contextValue": { "type": "string", "description": "Possible special contexts corresponding to standard units.\n                Available values:\n                \"CONTEXT_STD_UNIT_WEIGHT\" - Product weight in grams,\n                \"CONTEXT_STD_UNIT_WEIGHT_SI\" - Product weight in kilograms,\n                \"CONTEXT_STD_UNIT_VOLUME\" - A product's value in milliliters\n                \"CONTEXT_STD_UNIT_VOLUME_SI\" - A product's value in liters\n                \"CONTEXT_STD_UNIT_LENGTH\" - Length of product in meters\n                \"CONTEXT_STD_UNIT_AREA_M2\" - Area of ​​product in square meters\n                \"CONTEXT_STD_UNIT_VOLUME_M3\" - The volume of products in cubic meters\n                \"CONTEXT_STD_UNIT_QUANTITY_PACKAGE\" - Number of pieces per pack for standard unit", "enum": ["CONTEXT_STD_UNIT_WEIGHT", "CONTEXT_STD_UNIT_WEIGHT_SI", "CONTEXT_STD_UNIT_VOLUME", "CONTEXT_STD_UNIT_VOLUME_SI", "CONTEXT_STD_UNIT_LENGTH", "CONTEXT_STD_UNIT_AREA_M2", "CONTEXT_STD_UNIT_VOLUME_M3", "CONTEXT_STD_UNIT_QUANTITY_PACKAGE"] }, "standardUnitValue": { "type": "number", "description": "Total length/volume/area/weight of product", "format": "float" }, "converterUnitValue": { "type": "string", "description": "Price converter per unit.\n                Available values:\n                \"0\" - default (taken from the category),\n                \"1\" - price per gram/milliliter/meter\n                \"10\" - price per 10 grams/10 milliliters/10 meters\n                \"100\" - price per 100 grams/100 milliliters/100 meters\n                \"1000\" - price per liter/kilogram/kilometer", "enum": ["0", "1", "10", "100", "1000"] } } }, "minQuantityPerOrder": { "type": "object", "description": "Minimal number of products in an order", "properties": { "minQuantityPerOrderRetail": { "type": "number", "description": "Minimum number of products in a retail order", "format": "float" }, "minQuantityPerOrderWholesale": { "type": "number", "description": "Minimum number of products in a wholesale order", "format": "float" } } }, "dynamicPricingEnabled": { "type": "string", "description": "" }, "clearStockQuantities": { "type": "object", "description": "The setting allows you to reset the inventory to zero", "properties": { "clearAllStockQuantities": { "type": "boolean", "description": "The setting allows you to reset the inventories of warehouse M0 and all your own warehouses" }, "stocksListToClear": { "type": "array", "description": "List of warehouses for which inventories are to be reset", "items": { "type": "number" } } } }, "productDimensions": { "type": "object", "description": "Dimensions and overall weight", "properties": { "productWidth": { "type": "number", "description": "The width of a product in centimeters", "format": "float" }, "productHeight": { "type": "number", "description": "Height of a product in centimeters", "format": "float" }, "productLength": { "type": "number", "description": "The length of a product in centimeters", "format": "float" } } }, "responsibleProducerCode": { "type": "string", "description": "Responsible producer code" }, "responsiblePersonCode": { "type": "string", "description": "Responsible person code" }, "depositType": { "type": "number", "description": "Deposit type" }, "depositProductId": { "type": "number", "description": "Product deposit id" }, "depositCount": { "type": "number", "description": "Product deposit count" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_products_post", {
    name: "products_products_post",
    description: `The method is used to add products
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "settings": { "type": "object", "description": "Settings", "properties": { "settingPriceFormat": { "type": "string", "description": "Price format.\n            Parameter is currently unused." }, "settingAddingCategoryAllowed": { "type": "string", "description": "Object determines if new categories can be added when category linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - adding new categories not allowed (default value),\n            \"y\" - adding new categories is possible." }, "settingAddingSizeAllowed": { "type": "string", "description": "Object determines if new product sizes can be added when size linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - adding new sizes not allowed (default value),\n            \"y\" - adding new sizes is possible." }, "settingAddingProducerAllowed": { "type": "string", "description": "Object determines if new producers can be added when producer linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - you have no rights to add new manufacturers (default value),\n            \"y\" - adding new producer is possible." }, "settingAddingSeriesAllowed": { "type": "string", "description": "Object determines if new product series can be added when series linked with product couldn't be found in system.\n            Allowed values\n            \"n\" - you have no rights to add new product series (default value),\n            \"y\" - adding new series is possible." }, "settingDefaultCategory": { "type": "object", "description": "Object determines default category which will be linked with product when it will not be linked with any category..", "properties": { "categoryId": { "type": "number", "description": "Category id" }, "categoryName": { "type": "string", "description": "Category name" } } }, "settingDefaultSizesGroup": { "type": "object", "description": "Element specifying the default size group that will be assigned to the new product in case no size group has been explicitly assigned.", "properties": { "sizesGroupId": { "type": "number", "description": "Size group ID\n            Change of one size group to another results in zeroing all stock quantities in all stocks.\n            Change of size group can be made, if product is not present in any unhandled orders nor listed on auctions." }, "sizesGroupName": { "type": "string", "description": "Size group name." } } }, "settingsAddingDefaultShopMaskAllowed": { "type": "string", "description": "The item shall determine whether the default visibility in stores can be set if a new commodity is to be created and no parameters have been uploaded to set visibility in at least one store..", "enum": ["n", "y"] }, "settingsAddingManuallySelectedShopMaskAllowed": { "type": "number", "description": "Element specifying whether the default visibility in stores can be set according to the list of stores indicated in the web import source configuration, if a new product will be created and no parameters have been sent to set visibility in at least one store.." } } }, "picturesSettings": { "type": "object", "description": "Icon and photos settings", "properties": { "picturesSettingInitialUrlPart": { "type": "string", "description": "Object determines photo URL." }, "picturesSettingInputType": { "type": "string", "description": "Object determines the method of adding photos in \"pictures\" object.\n            Allowed values\n            \"base64\" - photos added in base64 coding algorithm,\n            \"url\" - photos added as URLs to external systems." }, "picturesSettingOverwrite": { "type": "string", "description": "Object determines the method of adding product photos.\n            Allowed values\n            \"n\" - photos are uploaded from the first free place,\n            \"y\" - photos are uploaded from the first place." }, "picturesSettingScaling": { "type": "string", "description": "Object determines if the photo should be scaled.\n            Allowed values\n            \"n\" - no scaling allowance,\n            \"y\" - scaling allowance." } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "productDisplayedCode": { "type": "string", "description": "External product system code." }, "productTaxCode": { "type": "string", "description": "PKWiU [PCPandS]." }, "productInWrapper": { "type": "number", "description": "Number of items in package data" }, "productSellByRetail": { "type": "number", "description": "Sold at - for retailers.", "format": "float" }, "productSellByWholesale": { "type": "number", "description": "Sold at - for wholesalers.", "format": "float" }, "categoryIdoSellId": { "type": "number", "description": "IdoSell Category ID" }, "categoryIdoSellPath": { "type": "string", "description": "IdoSell Category pathname" }, "categoryId": { "type": "number", "description": "Category id" }, "categoryName": { "type": "string", "description": "Category name" }, "producerId": { "type": "number", "description": "Brand ID" }, "producerName": { "type": "string", "description": "Brand name" }, "cnTaricCode": { "type": "string", "description": "CN/TARIC" }, "countryOfOrigin": { "type": "string", "description": "Country of origin. Country code in the ISO 3166-1 A2 standard" }, "unitId": { "type": "number", "description": "Product unit of measure ID." }, "seriesId": { "type": "number", "description": "ID of series, to which product belongs." }, "seriesPanelName": { "type": "string", "description": "Name of series, to which the product belongs, visible in panel." }, "sizesGroupId": { "type": "number", "description": "Size group ID\n            Change of one size group to another results in zeroing all stock quantities in all stocks.\n            Change of size group can be made, if product is not present in any unhandled orders nor listed on auctions." }, "priceChangeMode": { "type": "string", "description": "Optional element, that determines prices edition mode. Default value is \"amount_set\", when indicated element is omitted in API gate call..\n            Allowed values\n            \"amount_set\" - sets product prices to desired value (default mode),\n            \"amount_diff\" - sets sum difference between prices set (adds or subtracts entered sum from the current price),\n            \"percent_diff\" -\n            sets percentage difference between prices set (adds or subtracts entered percent from the current price)." }, "priceFormula": { "type": "object", "description": "The JavaScript formula calculating prices", "properties": { "priceFormulaParameters": { "type": "string", "description": "Formula parameters for calculating price" }, "priceFormulaFunction": { "type": "string", "description": "Formula function for calculating price" } } }, "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productWholesalePrice": { "type": "number", "description": "Wholesale price", "format": "float" }, "productMinimalPrice": { "type": "number", "description": "Minimal price", "format": "float" }, "productAutomaticCalculationPrice": { "type": "number", "description": "Price for automatic calculations", "format": "float" }, "productPosPrice": { "type": "number", "description": "price for POS.", "format": "float" }, "productVat": { "type": "number", "description": "Value of VAT", "format": "float" }, "productVatFree": { "type": "string", "description": "Is product VAT free\n            Allowed values\n            \"y\" - yes,\n            \"n\" - no." }, "productPriceComparisonSitesPrices": { "type": "array", "description": "Different prices for price comparison websites.", "items": { "type": "object", "properties": { "priceComparisonSiteId": { "type": "number", "description": "price comparison website ID" }, "productPriceComparisonSitePrice": { "type": "number", "description": "Price for a price comparison website in a shop", "format": "float" } } } }, "productEnableInPos": { "type": "string", "description": "Object determines if the product is available in POS sale\n            Available values:\n            \"n\" - no,\n            \"y\" - yes." }, "productAdvancePrice": { "type": "number", "description": "Required advance payment in percents", "format": "float" }, "productNote": { "type": "string", "description": "Annotation." }, "productProfitPoints": { "type": "number", "description": "Product value in points.", "format": "float" }, "productWeight": { "type": "number", "description": "Weight." }, "productInVisible": { "type": "string", "description": "Product visibility.\n            Allowed values\n            \"y\" - product visible,\n            \"n\" - product not visible." }, "productInPersistent": { "type": "string", "description": "Product visible even though out of stock\n            Available values:\n            \"y\" - visible even though out of stock,\n            \"n\" - not visible when out of stock." }, "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." }, "productComplexNotes": { "type": "number", "description": "Complex rating\n            Available values:\n            \"0\" - no,\n            \"1\" - yes." }, "productInExportToPriceComparisonSites": { "type": "string", "description": "Product visibility in export to price comparison and marketplaces.\n                Available values:\n                \"y\" - Visible,\n                \"selected\" - yes (selected),\n                \"n\" - invisible." }, "priceComparisonSites": { "type": "array", "description": "Selection of comparison sites for which the product visibility will be changed", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "priceComparisonSiteId": { "type": "number", "description": "price comparison website ID" } } } }, "productInExportToAmazonMarketplace": { "type": "string", "description": "Visibility of an item in an export to Amazon Marketplace.\n            Available values:\n            \"y\" - Visible,\n            \"selected\" - Visible on selected regional services,\n            \"n\" - invisible." }, "availableProfile": { "type": "number", "description": "Availability profile ID." }, "productRebate": { "type": "number", "description": "Discount profile ID" }, "warrantyId": { "type": "number", "description": "Product warranty ID." }, "productPriority": { "type": "number", "description": "Priority.\n            Allowed values from 1 to 10." }, "productIcon": { "type": "string", "description": "Product icon details." }, "productWatermarkId": { "type": "number", "description": "Watermark ID" }, "productWatermarkUrl": { "type": "string", "description": "Link to watermark" }, "productPictures": { "type": "array", "description": "List of product photos", "items": { "type": "string" } }, "productDescriptionPictures": { "type": "array", "description": "List of photos descriptions", "items": { "type": "string" } }, "productParametersDistinction": { "type": "array", "description": "Parameters (distinguished).", "items": { "type": "object", "properties": { "parameterId": { "type": "number", "description": "Parameter ID" }, "parameterName": { "type": "string", "description": "Parameter name." }, "parameterValueId": { "type": "number", "description": "Parameter value ID" }, "parameterValueName": { "type": "string", "description": "Attributes group name." } } } }, "associatedProducts": { "type": "array", "description": "List of products recommended with this product", "items": { "type": "object", "properties": { "associatedProductId": { "type": "number", "description": "Recommended product ID" }, "associatedProductName": { "type": "string", "description": "Recommended product name" }, "associatedProductCode": { "type": "string", "description": "Recommended product code. External system code." } } } }, "productSizes": { "type": "array", "description": "Sizes available for products data.", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" }, "productWeight": { "type": "number", "description": "Weight." }, "productWeightNet": { "type": "number", "description": "Net weight." }, "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productWholesalePrice": { "type": "number", "description": "Wholesale price", "format": "float" }, "productMinimalPrice": { "type": "number", "description": "Minimal price", "format": "float" }, "productAutomaticCalculationPrice": { "type": "number", "description": "Price for automatic calculations", "format": "float" }, "productPosPrice": { "type": "number", "description": "price for POS.", "format": "float" }, "productAuctionPrices": { "type": "array", "description": "Prices for marketplaces", "items": { "type": "object", "properties": { "productAuctionId": { "type": "number", "description": "Auction system ID" }, "productAuctionSiteId": { "type": "number", "description": "Auction site ID" }, "productAuctionPrice": { "type": "number", "description": "Price for auction site", "format": "float" } } } }, "productCode": { "type": "string", "description": "External product system code" }, "productInPersistent": { "type": "string", "description": "Product visible even though out of stock\n            Available values:\n            \"y\" - visible even though out of stock,\n            \"n\" - not visible when out of stock." }, "productStocksData": { "type": "object", "description": "Product stock quantity data.", "properties": { "productStockQuantities": { "type": "array", "description": "Object contains information on product quantity", "items": { "type": "object", "properties": { "stockId": { "type": "number", "description": "Stock ID" }, "productSizeQuantity": { "type": "number", "description": "Product stock quantity", "format": "decimal" }, "productSizeQuantityToAdd": { "type": "number", "description": "Product quantity to add up", "format": "decimal" }, "productSizeQuantityToSubstract": { "type": "number", "description": "Product quantity to subtract", "format": "decimal" } } } } } }, "shopsSizeAttributes": { "type": "array", "description": "Object contains information dependent on shop and size.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productWholesalePrice": { "type": "number", "description": "Wholesale price", "format": "float" }, "productMinimalPrice": { "type": "number", "description": "Minimal price", "format": "float" }, "productAutomaticCalculationPrice": { "type": "number", "description": "Price for automatic calculations", "format": "float" } } } } } } }, "productShopsAttributes": { "type": "array", "description": "Data concerning attributes dependent on indicated stores with particular product assigned.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "productShopPriceComparisonSitesPrices": { "type": "array", "description": "Information about prices for price comparison websites dependent on a shop", "items": { "type": "object", "properties": { "priceComparisonSiteId": { "type": "number", "description": "price comparison website ID" }, "productPriceComparisonSitePercentDiff": { "type": "number", "description": "Percentage difference between the price comparison website and the shop", "format": "float" } } } } } } }, "subscription": { "type": "array", "description": "Products subscription settings.", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "enabled": { "type": "boolean", "description": "Is subscription enabled for product" }, "daysInPeriod": { "type": "array", "description": "Days in period", "items": { "type": "number" } }, "unitsNumberRetail": { "type": "number", "description": "Sold at - for retailers.", "format": "float" }, "unitsNumberWholesale": { "type": "number", "description": "Sold at - for wholesalers.", "format": "float" } } } }, "productNames": { "type": "object", "description": "Product name.", "properties": { "productNamesLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productName": { "type": "string", "description": "Product name." } } } } } }, "productDescriptions": { "type": "object", "description": "", "properties": { "productDescriptionsLangData": { "type": "array", "description": "Array of language-dependent elements.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productDescription": { "type": "string", "description": "Short product description." } } } } } }, "productLongDescriptions": { "type": "object", "description": "Long product description", "properties": { "productLongDescriptionsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "productLongDescription": { "type": "string", "description": "Long product description." } } } } } }, "productAuctionDescriptionsData": { "type": "array", "description": "Product data for auction services", "items": { "type": "object", "properties": { "productAuctionId": { "type": "string", "description": "Auction system ID" }, "productAuctionSiteId": { "type": "string", "description": "Auction site ID" }, "productAuctionName": { "type": "string", "description": "Product name for auction service." }, "productAuctionAdditionalName": { "type": "string", "description": "Subtitle for auction service " }, "productAuctionDescription": { "type": "string", "description": "Product description for marketplaces" } } } }, "productMetaTitles": { "type": "object", "description": "Product meta title", "properties": { "productMetaTitlesLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "productMetaTitle": { "type": "string", "description": "Product meta title." } } } } } }, "productMetaDescriptions": { "type": "object", "description": "Product meta description", "properties": { "productMetaDescriptionsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "productMetaDescription": { "type": "string", "description": "Product meta description." } } } } } }, "productMetaKeywords": { "type": "object", "description": "Product meta keywords.", "properties": { "productMetaKeywordsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "langName": { "type": "string", "description": "Language name" }, "productMetaKeyword": { "type": "string", "description": "Product meta keywords." } } } } } }, "productUrl": { "type": "object", "description": "#!AdresURLDlaTowaru!#.", "properties": { "productUrlsLangData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "langId": { "type": "string", "description": "Language ID" }, "url": { "type": "string", "description": "" } } } } } }, "productVersion": { "type": "object", "description": "Data on product groups (variants)", "properties": { "versionParentId": { "type": "number", "description": "ID of the main item (variant) in the group" }, "versionPriority": { "type": "number", "description": "The order of products in the group. Value needs to be more than 0." }, "versionSettings": { "type": "object", "description": "Settings for groups of items (variants)", "properties": { "versionDisplayAllInShop": { "type": "string", "description": "Show in shop.\n            Available values:\n            \"y\" - all products from group,\n            \"n\" - only the first product from group." }, "versionCommonCode": { "type": "string", "description": "The same code.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonProducer": { "type": "string", "description": "The same brand.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonNote": { "type": "string", "description": "The same annotation.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonWarranty": { "type": "string", "description": "The same warranty.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSeries": { "type": "string", "description": "The same series.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonCategory": { "type": "string", "description": "The same category.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPrice": { "type": "string", "description": "The same price.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAuctionsPrice": { "type": "string", "description": "Same price for auction services.\n            possible values\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAdvance": { "type": "string", "description": "Same advance.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonRebate": { "type": "string", "description": "Same quantity discount.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonVat": { "type": "string", "description": "the same VAT rate.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonProfitPoints": { "type": "string", "description": "The same loyalty points.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPromotion": { "type": "string", "description": "The same promotion.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonDiscount": { "type": "string", "description": "The same loyalty discount.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonDistinguished": { "type": "string", "description": "The same privileged products.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSpecial": { "type": "string", "description": "The same for special.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonTraits": { "type": "string", "description": "DEPRECATED" }, "versionCommonAssociated": { "type": "string", "description": "The same related product.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonVisibility": { "type": "string", "description": "The same visibility.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPersistent": { "type": "string", "description": "Same display when not in stock.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPriority": { "type": "string", "description": "The same priority.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonShops": { "type": "string", "description": "The same shops.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSizes": { "type": "string", "description": "The same sizes.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonUnit": { "type": "string", "description": "The same unit of measure.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonWeight": { "type": "string", "description": "The same weight.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonDictionary": { "type": "string", "description": "The same parameters.\n            possible values\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonName": { "type": "string", "description": "The same name.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonDescription": { "type": "string", "description": "The same short description.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonLongDescription": { "type": "string", "description": "The same long description.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonIcon": { "type": "string", "description": "The same icon.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonPhotos": { "type": "string", "description": "The same large photos.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonAvailableProfile": { "type": "string", "description": "The same availability profile.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonComplexNotes": { "type": "string", "description": "The same complex rating.\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "versionCommonSumInBasket": { "type": "string", "description": "Do You wish to sum up the products in the basket as a one order?\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." } } }, "versionNames": { "type": "object", "description": "Parameter value names", "properties": { "versionNamesLangData": { "type": "array", "description": "Array of languages, values are displayed in.", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "versionName": { "type": "string", "description": "Name of the parameter value, e.g. orange, green, red" } } } } } }, "versionGroupNames": { "type": "object", "description": "Parameter names", "properties": { "versionGroupNamesLangData": { "type": "array", "description": "Parameter name", "items": { "type": "object", "properties": { "langId": { "type": "string", "description": "Language ID" }, "versionGroupName": { "type": "string", "description": "Parameter name, e.g. color, width" } } } } } } } }, "currencyId": { "type": "string", "description": "Currency ID" }, "delivererId": { "type": "number", "description": "Supplier ID." }, "productParametersDistinctionChangeMode": { "type": "string", "description": "This parameter is optional and it determines properties edition mode.\n            Default value is \"replace\".\n            Allowed values:\n            \"add\" - adds properties to already existent ones,\n            \"delete\" - removes properties of already existent ones,\n            \"delete_group\" - removes properties from selected group,\n            \"replace\" - overwrites properties already existent with new ones (default mode).", "enum": ["add", "delete", "delete_group", "replace"] }, "productDeliveryTime": { "type": "object", "description": "Product delivery time from the producer to the shop", "properties": { "productDeliveryTimeChangeMode": { "type": "string", "description": "Operation type:\n            \"product\" - sets own product delivery time,\n            \"deliverer\" - sets product delivery time exactly the same as deliverer's.", "enum": ["product", "deliverer"] }, "productDeliveryTimeValue": { "type": "number", "description": "The amount of time it takes to get goods from the supplier to the store. The maximum time is 99 for the unit \"days\" or 999 for the unit \"hours\" and \"minutes\"" } } }, "productSumInBasket": { "type": "string", "description": "Do You wish to sum up the products in the basket as a one order?\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "dispatchSettings": { "type": "object", "description": "Shipping, returns and complaints settings", "properties": { "enabled": { "type": "boolean", "description": "" }, "shippingSettings": { "type": "object", "description": "Shipping settings", "properties": { "codDisabled": { "type": "boolean", "description": "Disable cash on delivery orders" }, "dvpOnly": { "type": "boolean", "description": "Only personal collection" }, "atypicalSize": { "type": "boolean", "description": "Oversized product" }, "insuranceOnly": { "type": "boolean", "description": "Insurance required" }, "excludeSmileService": { "type": "boolean", "description": "Exclusion from the Smile service" }, "disallowedCouriers": { "type": "array", "description": "List of courier services which cannot be used to ship this product", "items": { "type": "number" } } } }, "freeShippingSettings": { "type": "object", "description": "Free shipping settings", "properties": { "mode": { "type": "string", "description": "Edition mode", "enum": ["no", "onlyProduct", "wholeBasket"] }, "availablePaymentForms": { "type": "object", "description": "Set free shipping for the payment method only .", "properties": { "prepaid": { "type": "boolean", "description": "prepayment" }, "cashOnDelivery": { "type": "boolean", "description": "Cash on delivery" }, "tradeCredit": { "type": "boolean", "description": "Trade credit" } } }, "availableCouriers": { "type": "array", "description": "List of courier services for which shipping is free", "items": { "type": "number" } }, "availableRegions": { "type": "array", "description": "List of regions with free shipment", "items": { "type": "number" } } } }, "returnProductSettings": { "type": "object", "description": "Return and complaint settings", "properties": { "returnOptions": { "type": "object", "description": "Product can be returned", "properties": { "enabled": { "type": "boolean", "description": "" }, "firm": { "type": "boolean", "description": "yes - for companies" }, "hurt": { "type": "boolean", "description": "yes - for wholesalers" }, "detalist": { "type": "boolean", "description": "yes - for retailers" } } }, "byOwnService": { "type": "boolean", "description": "" }, "byInPostSzybkieZwrotyByIAI": { "type": "boolean", "description": "" } } } } }, "standardUnit": { "type": "object", "description": "Standard unit settings", "properties": { "contextValue": { "type": "string", "description": "Possible special contexts corresponding to standard units.\n                Available values:\n                \"CONTEXT_STD_UNIT_WEIGHT\" - #!WagaTowaruWGramach!#,\n                \"CONTEXT_STD_UNIT_WEIGHT_SI\" - Product weight in kilograms,\n                \"CONTEXT_STD_UNIT_VOLUME\" - A product's value in milliliters\n                \"CONTEXT_STD_UNIT_VOLUME_SI\" - A product's value in liters\n                \"CONTEXT_STD_UNIT_LENGTH\" - Length of product in meters\n                \"CONTEXT_STD_UNIT_AREA_M2\" - Area of ​​product in square meters\n                \"CONTEXT_STD_UNIT_VOLUME_M3\" - The volume of products in cubic meters\n                \"CONTEXT_STD_UNIT_QUANTITY_PACKAGE\" - Number of pieces per pack for standard unit", "enum": ["CONTEXT_STD_UNIT_WEIGHT", "CONTEXT_STD_UNIT_WEIGHT_SI", "CONTEXT_STD_UNIT_VOLUME", "CONTEXT_STD_UNIT_VOLUME_SI", "CONTEXT_STD_UNIT_LENGTH", "CONTEXT_STD_UNIT_AREA_M2", "CONTEXT_STD_UNIT_VOLUME_M3", "CONTEXT_STD_UNIT_QUANTITY_PACKAGE"] }, "standardUnitValue": { "type": "number", "description": "Total length/volume/area/weight of product", "format": "float" }, "converterUnitValue": { "type": "string", "description": "Price converter per unit.\n                Available values:\n                \"0\" - default (taken from the category),\n                \"1\" - price per gram/milliliter/meter\n                \"10\" - price per 10 grams/10 milliliters/10 meters\n                \"100\" - price per 100 grams/100 milliliters/100 meters\n                \"1000\" - price per liter/kilogram/kilometer", "enum": ["0", "1", "10", "100", "1000"] } } }, "minQuantityPerOrder": { "type": "object", "description": "Minimal number of products in an order", "properties": { "minQuantityPerOrderRetail": { "type": "number", "description": "Minimum number of products in a retail order", "format": "float" }, "minQuantityPerOrderWholesale": { "type": "number", "description": "Minimum number of products in a wholesale order", "format": "float" } } }, "productDimensions": { "type": "object", "description": "Dimensions and overall weight", "properties": { "productWidth": { "type": "number", "description": "The width of a product in centimeters", "format": "float" }, "productHeight": { "type": "number", "description": "Height of a product in centimeters", "format": "float" }, "productLength": { "type": "number", "description": "The length of a product in centimeters", "format": "float" } } }, "responsibleProducerCode": { "type": "string", "description": "Responsible producer code" }, "responsiblePersonCode": { "type": "string", "description": "Responsible person code" }, "depositType": { "type": "number", "description": "Deposit type" }, "depositProductId": { "type": "number", "description": "Product deposit id" }, "depositCount": { "type": "number", "description": "Product deposit count" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_products_search_post", {
    name: "products_products_search_post",
    description: `Method that enables extracting information about non-deleted products available in the administration panel
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "dispatchSettings": { "type": "object", "description": "", "properties": { "enabled": { "type": "boolean", "description": "" }, "shippingSettings": { "type": "object", "description": "", "properties": { "codDisabled": { "type": "string", "description": "", "enum": ["true", "false"] }, "dvpOnly": { "type": "string", "description": "", "enum": ["true", "false"] }, "insuranceOnly": { "type": "string", "description": "", "enum": ["true", "false"] }, "atypicalSize": { "type": "boolean", "description": "" }, "excludeSmileService": { "type": "boolean", "description": "Exclusion from the Smile service" }, "disallowedCouriers": { "type": "array", "description": "List of courier services which cannot be used to ship this product. IDs couriers", "items": { "type": "number" } } } }, "freeShippingSettings": { "type": "object", "description": "", "properties": { "mode": { "type": "string", "description": "Edition mode", "enum": ["no", "onlyProduct", "wholeBasket"] }, "availablePaymentForms": { "type": "object", "description": "Set free shipping for the payment method only ", "properties": { "prepaid": { "type": "boolean", "description": "" }, "cashOnDelivery": { "type": "boolean", "description": "Cash on delivery." }, "tradeCredit": { "type": "boolean", "description": "" } } }, "availableCouriers": { "type": "array", "description": "List of courier services for which shipping is free. IDs couriers", "items": { "type": "number" } }, "availableCouriersForSingleProduct": { "type": "array", "description": "List of courier services by which the products can be sent free of charge. IDs couriers", "items": { "type": "number" } }, "availableRegions": { "type": "array", "description": "List of regions with free shipment. IDs Delivery regions", "items": { "type": "number" } } } }, "returnProductSettings": { "type": "object", "description": "", "properties": { "returnOptions": { "type": "object", "description": "Product can be returned", "properties": { "enabled": { "type": "boolean", "description": "" }, "firm": { "type": "boolean", "description": "" }, "hurt": { "type": "boolean", "description": "" }, "detalist": { "type": "boolean", "description": "" } } }, "byOwnService": { "type": "string", "description": "", "enum": ["true", "false"] }, "byInPostSzybkieZwrotyByIAI": { "type": "string", "description": "", "enum": ["true", "false"] } } } } }, "returnProducts": { "type": "string", "description": "Element determines which products should be returned by the gate.\n            Undeleted products are returned by default.\n            Available values:\n            \"active\" - undeleted products,\n            \"deleted\" - deleted products.\n            \"in_trash\" - products in the trash." }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned\n                Available values:\n                * lang_data\n                * adding_time,\n                * deleted,\n                * code,\n                * note,\n                * taxcode,\n                * inwrapper,\n                * sellby_retail,\n                * sellby_wholesale,\n                * producer_id,\n                * producer_name,\n                * iaiCategoryId,\n                * iaiCategoryName,\n                * iaiCategoryPath,\n                * category_id,\n                * category_name,\n                * size_group_id,\n                * modification_time,\n                * currency,\n                * currency_shop,\n                * bestseller,\n                * new_product,\n                * retail_price,\n                * wholesale_price,\n                * minimal_price,\n                * automatic_calculation_price,\n                * pos_price,\n                * strikethrough_retail_price,\n                * strikethrough_wholesale_price,\n                * last_purchase_price,\n                * purchase_price_net_average,\n                * purchase_price_net_last,\n                * purchase_price_gross_average,\n                * purchase_price_gross_last,\n                * vat,\n                * vat_free,\n                * rebate,\n                * hotspots_zones,\n                * profit_points,\n                * points,\n                * weight,\n                * export_to_pricecomparers,\n                * export_to_amazon_marketplace,\n                * enable_in_pos,\n                * complex_notes,\n                * available_profile,\n                * traits,\n                * parameters,\n                * version_data,\n                * advance,\n                * promotion,\n                * discount,\n                * distinguished,\n                * special,\n                * visible,\n                * persistent,\n                * priority,\n                * shops_mask,\n                * icon,\n                * icon_for_auctions,\n                * icon_for_group,\n                * pictures,\n                * unit,\n                * warranty,\n                * series,\n                * products_associated,\n                * shops,\n                * quantities,\n                * sizes_attributes,\n                * shops_attributes,\n                * auction_prices,\n                * price_comparers_prices,\n                * deliverer,\n                * sizes,\n                * size_group_name,\n                * pictures_count,\n                * product_type,\n                * price_changed_time,\n                * quantity_changed_time,\n                * deliverer_name,\n                * available_profile_name,\n                * availability_management_type,\n                * sum_in_basket,\n                * menu,\n                * auction_settings,\n                * bundle,\n                * sizeschart_id,\n                * sizeschart_name,\n                * serialnumbers,\n                * producer_codes_standard,\n                * javaScriptInTheItemCard,\n                * productAuctionDescriptionsData,\n                * priceFormula,\n                * productIndividualDescriptionsData,\n                * productIndividualUrlsData,\n                * productServicesDescriptionsData,\n                * cnTaricCode,\n                * productIsGratis,\n                * dimensions,\n                * responsibleProducerCode,\n                * responsiblePersonCode,\n                * dimensions,\n                * depositProductId,\n                * depositType,\n                * depositCount,\n                * minStockLevel,\n                * productAttachments", "items": { "type": "string" } }, "productIsAvailable": { "type": "string", "description": "Product availability. Available values: \"y\" - available, \"n\" - unavailable." }, "productIsVisible": { "type": "string", "description": "Product visibility in store\n            Available values:\n            \"y\" - Visible,\n            \"n\" - Invisible." }, "productVersionId": { "type": "number", "description": "Product group ID" }, "productInPromotion": { "type": "string", "description": "Promoted product.\n            Available values:\n            \"y\" - promoted,\n            \"n\" - not promoted." }, "productInDiscount": { "type": "string", "description": "Product on sale.\n            Available values:\n            \"y\" - on sale,\n            \"n\" - not on sale." }, "productInDistinguished": { "type": "string", "description": "Distinguished product.\n            Available values:\n            \"y\" - distinguished,\n            \"n\" - not distinguished." }, "productInSpecial": { "type": "string", "description": "Special product.\n            Available values:\n            \"y\" - #!specjalny!#,\n            \"n\" - not special." }, "productInForPointsSelling": { "type": "string", "description": "Product available for points.\n            Available values:\n            \"y\" - Available for points,\n            \"n\" - Unavailable for points." }, "productIsObservedByClients": { "type": "string", "description": "Observed product.\n            Available values:\n            \"Y\" - observed,\n            \"n\" - not observed." }, "skipDefaultProduct": { "type": "string", "description": "Element determines if default product (with 0 ID, contains settings of newly added products) should be omitted\n            Available values:\n            \"y\" - omits default product,\n            \"n\" - allows to download default product." }, "showPromotionsPrices": { "type": "string", "description": "The item specifies whether promotional prices are to be shown in price nodes.\n            Available values:\n            \"y\" - show promotional prices,\n            \"n\" - do not show promotional prices. (default value)" }, "categories": { "type": "array", "description": "List of categories in which sought products are present.", "items": { "type": "object", "properties": { "categoryId": { "type": "number", "description": "Category id" }, "categoryName": { "type": "string", "description": "Category name" } } } }, "producers": { "type": "array", "description": "List of manufacturers assigned to sought products.", "items": { "type": "object", "properties": { "producerId": { "type": "number", "description": "Brand ID" }, "producerName": { "type": "string", "description": "Brand name" } } } }, "productParams": { "type": "array", "description": "List of sought products. This parameter can be used, when there have been no other parameter entered productIndexes.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productCode": { "type": "string", "description": "External product system code" }, "productName": { "type": "string", "description": "Product name." }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "productProducerCode": { "type": "string", "description": "Producer code" }, "productIsGratis": { "type": "string", "description": "The product is free of charge. Possible values: \"y\" - is free of charge, \"n\" - is not free of charge." } } } }, "productIndexes": { "type": "array", "description": "List of sought products by indexes.", "items": { "type": "object", "properties": { "productIndex": { "type": "string", "description": "One of the unique, indexed product codes (IAI code / External system code / Producer code)" } } } }, "productShops": { "type": "array", "description": "Data of stores product is assigned to.", "items": { "type": "object", "properties": { "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." }, "shopId": { "type": "number", "description": "Shop Id" } } } }, "productPromotionsIds": { "type": "array", "description": "List of special offers, sought products are assigned to.", "items": { "type": "number" } }, "productDate": { "type": "object", "description": "Settings concerning narrowing list of products found by date.", "properties": { "productDateMode": { "type": "string", "description": "Date type.\n            Allowed values\n            \"added\" - #!dataDodaniaProduktu!#,\n            \"finished\" - date of running out of product,\n            \"resumed\" - date of resuming product,\n            \"modified\" - date of last modification of product,\n            \"quantity_changed\" - date of last product stock quantity modification,\n            \"price_changed\" - date of last price change,\n            \"modified_and_quantity_changed\" - date of last modification and stock quantity change." }, "productDateBegin": { "type": "string", "description": "Starting date in the YYYY-MM-DD format" }, "productDateEnd": { "type": "string", "description": "End date in the YYYY-MM-DD format" } } }, "productParametersParams": { "type": "array", "description": "Parameters", "items": { "type": "object", "properties": { "parameterNames": { "type": "array", "description": "Parameters group name", "items": { "type": "string" } }, "parameterValuesIds": { "type": "array", "description": "Properties IDs", "items": { "type": "number" } }, "parameterValuesNames": { "type": "array", "description": "Parameters name", "items": { "type": "string" } }, "productParameterIds": { "type": "object", "description": "Parameters group ID", "properties": { "productParameterIdsEnabled": { "type": "array", "description": "Set properties groups ID.", "items": { "type": "number" } }, "productParameterIdsDisabled": { "type": "array", "description": "Unset properties groups ID.", "items": { "type": "number" } } } } } } }, "productSeriesParams": { "type": "array", "description": "Series, sought products are assigned to.", "items": { "type": "object", "properties": { "seriesId": { "type": "number", "description": "ID of series, to which product belongs." }, "seriesPanelName": { "type": "string", "description": "Name of series, to which the product belongs, visible in panel." }, "seriesDescriptionsLangData": { "type": "array", "description": "Names of series in indicated language visible in shop.", "items": { "type": "object", "properties": { "seriesName": { "type": "string", "description": "Name of series in indicated language" }, "langId": { "type": "string", "description": "Language ID" } } } } } } }, "productUnits": { "type": "array", "description": "List of units of measure assigned to sought products.", "items": { "type": "object", "properties": { "unitId": { "type": "number", "description": "Product unit of measure ID." }, "unitName": { "type": "string", "description": "Product unit of measure name." }, "unitPrecision": { "type": "number", "description": "Unit of measure precision." } } } }, "productWarranties": { "type": "array", "description": "Narrowing list of products by set warranties.", "items": { "type": "object", "properties": { "warrantyId": { "type": "number", "description": "Product warranty ID." }, "warrantyName": { "type": "string", "description": "Name of warranty for indicated product." } } } }, "deliverersIds": { "type": "array", "description": "Suppliers, sought products are assigned to.", "items": { "type": "number" } }, "containsText": { "type": "string", "description": "Product contains text (searches in short and long description). " }, "containsCodePart": { "type": "string", "description": "Product code or it's part (based on producer's code, external product system code and code that is visible on a product card).\n            Search is accesible only with available products." }, "productAvailableInStocks": { "type": "object", "description": "Product availability in stocks", "properties": { "productIsAvailableInStocks": { "type": "string", "description": "Determines whether availability in stocks has been set. Available values: \"y\" -\n            is available in stocks, \"n\" - unavailable in stocks." }, "productAvailableInStocksIds": { "type": "array", "description": "Narrowing list to stocks sought trough Empty list concerns all stocks.", "items": { "type": "number" } } } }, "productAvailableInAuctions": { "type": "object", "description": "Product availability on auctions", "properties": { "productIsAvailableInAuctions": { "type": "string", "description": "Determines whether availability on auctions has been set.\n            Available values:\n            \"y\" - is available on auctions,\n            \"n\" - is not available on auctions." }, "productAvailableInAuctionsAccountsIds": { "type": "array", "description": "Narrow list of auction accounts sought through.", "items": { "type": "number" } } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "ordersBy": { "type": "array", "description": "Possibility of sorting returned list", "items": { "type": "object", "properties": { "elementName": { "type": "string", "description": "Name of field, list will be sorted by.\n            Available values:\n            \"id\" - product ID,\n            \"name\" - Product name,\n            \"code\" - Product code,\n            \"product_sizecode\" - External system code,\n            \"code_producer\" - Producer code,\n            \"retail_price\" - Retail price of the product,\n            \"pos_price\" - price for POS,\n            \"vat\" - Value of VAT,\n            \"wholesale_price\" - wholesale price,\n            \"minimal_price\" - Minimal price,\n            \"pictures_count\" - number of product photos,\n            \"auction_name\" - product name for auction sites,\n            \"pricecomparer_name\" - Product name for price comparison websites,\n            \"version_name\" - Name of the good in the group,\n            \"series_name\" - Name of the batch,\n            \"category_name\" - Category name,\n            \"deliverer_name\" - Supplier name,\n            \"adding_time\" - Date of entry,\n            \"modification_time\" - date modified,\n            \"price_changed_time\" - Date of last price change,\n            \"quantity_changed_time\" - Date of modification of stock levels,\n            \"currency\" - Currency DEPRECATED. This parameter is deprecated,\n            \"currency_shop\" - Currency,\n            \"taxcode\" - PKWiU [PCPandS],\n            \"meta_title\" - Products meta titles,\n            \"meta_description\" - Products meta description,\n            \"meta_keywords\" - Products meta keywords,\n            \"suggested_price\" - Recommended price.\n            \"observed_clients\" - Number of visitors, who signed up to re-availability notifications\n            \"observed_time\" - Average time of waiting for availability notification\n            \"wishes_clients\" - Customers, who added product to favorites\n            \"wishes_time\" - Average number of days, product is in favorites" }, "sortDirection": { "type": "string", "description": "Determines sorting direction.\n            Available values:\n            \"ASC\" - ascending,\n            \"DESC\" - descending." } } } }, "productSearchingLangId": { "type": "string", "description": "Language ID that allows to search and return data in chosen language.\n            This parameter is optional. If it's lacking, she search process unfolds in all available languages." }, "productSearchingCurrencyId": { "type": "string", "description": "Currency ID allowing to search and browse products in given currency.\n            This parameter is optional, when it's lacking, the search process unfolds in all available currencies. " }, "returnPricesCurrency": { "type": "string", "description": "Currency ID allowing for returning all product prices in an indicated currency" }, "productHasNote": { "type": "string", "description": "Annotation contains text." }, "productInExportToPriceComparisonSites": { "type": "string", "description": "Product visibility in export to price comparison and marketplaces.\n            Available values:\n            \"y\" - Visible,\n            \"selected\" - Selected,\n            \"assign_selected\" - Enable the visibility of the product in the export to price comparison sites passed in the priceComparisonSites node. Price comparison sites previously assigned to the commodity will be retained,\n            \"unassign_selected\" - Disable product visibility in exports to price comparison sites passed in the priceComparisonSites node,\n            \"n\" - invisible." }, "productInExportToAmazonMarketplace": { "type": "string", "description": "Visibility of an item in an export to Amazon Marketplace.\n            Available values:\n            \"y\" - Visible,\n            \"selected\" - Visible on selected regional services,\n            \"n\" - invisible." }, "selectedAmazonMarketplacesList": { "type": "array", "description": "List of Amazon regional sites to which the product is exported (only in case of \"selected\" option)", "items": { "type": "string" } }, "productInBestseller": { "type": "string", "description": "Product is bestseller.\n            Available values:\n            \"n\" - no,\n            \"y\" - yes." }, "productInNew": { "type": "string", "description": "Product is new.\n            Available values:\n            \"y\" - is new,\n            \"n\" - is not new." }, "searchByShops": { "type": "object", "description": "Shops", "properties": { "searchModeInShops": { "type": "string", "description": "Determine data search method on basis of options set for stores.\n            Available values:\n            \"in_one_of_selected\" - in one of indicated stores,\n            \"in_all_of_selected\" - in all indicated stores,\n            This parameter is optional. When it's lacking, search is performed by option: in one of indicated stores (in_one_of_selected)." }, "shopsMask": { "type": "number", "description": "Bit mask of shop IDs.\n            Mask for indicated store is calculated on basis of following formula:\n            2^(store_ID - 1).\n            If the product should be available in more than one shop, the masks should be summed up." }, "shopsIds": { "type": "array", "description": "List of stores IDs When mask is determined, this parameter is omitted.", "items": { "type": "number" } } } }, "productSearchPriceRange": { "type": "object", "description": "Price range for sought products.", "properties": { "productSearchPriceMode": { "type": "string", "description": "Determines price type for indicated values.\n            Available values:\n            \"retail_price\" - Retail price of the product,\n            \"wholesale_price\" - Wholesale price of the product,\n            \"minimal_price\" - Product minimal price,\n            \"pos_price\" - price for POS,\n            \"last_purchase_price\" - Last purchase price." }, "productSearchPriceMin": { "type": "number", "description": "Minimal price for product.", "format": "float" }, "productSearchPriceMax": { "type": "number", "description": "Maximum price for product.", "format": "float" }, "shopId": { "type": "number", "description": "Shop Id" } } }, "productVatRates": { "type": "array", "description": "VAT value for sought products", "items": { "type": "number" } }, "productIsVatFree": { "type": "string", "description": "Is product VAT-free\n            Allowed values\n            \"y\" - yes,\n            \"n\" - no." }, "productHasWholesalePrice": { "type": "string", "description": "Product has defined wholesale price.\n            Available values:\n            \"y\" - has wholesale price,\n            \"n\" - does not have wholesale price." }, "productInPersistent": { "type": "string", "description": "Product visible even though out of stock\n            Available values:\n            \"y\" - visible even though out of stock,\n            \"n\" - not visible when out of stock." }, "returnProductsVersions": { "type": "string", "description": "Settings of products returned with variants \n            All products with variants are returned by default\n            Available values:\n            version_all - returns all variants,\n            version_main - returns only main variant." }, "productInSumInBasket": { "type": "string", "description": "Do You wish to sum up the products in the basket as a one order?\n            Available values:\n            \"y\" - yes,\n            \"n\" - no." }, "productType": { "type": "object", "description": "Product type. Allowed values:\n                \"product_item\" - Goods,\n                \"product_packaging\" - packaging,\n                \"product_bundle\" - set.\n                \"product_collection\" - collection.\n                \"product_service\" - service.\n                \"product_virtual\" - virtual product.\n                \"product_configurable\" - configurable product.", "properties": { "productTypeInItem": { "type": "boolean", "description": "Should products be returned on list. By default this parameter is set on true." }, "productTypeInBundle": { "type": "boolean", "description": "Should sets be returned on list. By default this parameter is set on true." }, "productTypeInCollection": { "type": "boolean", "description": "Should collections be returned. By default this parameter is set on true." }, "productTypeInPackaging": { "type": "boolean", "description": "Should packagings be returned on list. By default this parameter is set on true." }, "productTypeInService": { "type": "boolean", "description": "Should services be returned. By default this parameter is set on true." }, "productTypeInVirtual": { "type": "boolean", "description": "Should virtuals be returned. By default this parameter is set on true." }, "productTypeInConfigurable": { "type": "boolean", "description": "Should configurable be returned. By default this parameter is set on true." } } }, "productMenuItems": { "type": "object", "description": "An array of menu elements", "properties": { "menuItemsIds": { "type": "array", "description": "An array of IDs", "items": { "type": "number" } }, "menuItemsTextIds": { "type": "array", "description": "An array of text IDs", "items": { "type": "object", "properties": { "menuItemTextId": { "type": "string", "description": "Menu element text identifier.\n            Example: \"item1\\item2\\item3\"." }, "shopId": { "type": "number", "description": "Shop Id" }, "menuId": { "type": "number", "description": "ID of the menu zone displayed in the mask" }, "menuItemTextIdSeparator": { "type": "string", "description": "The separator separates the individual elements of a text id.\n            Default: \"\\\"." } } } } } }, "productLocationId": { "type": "number", "description": "Warehouse location ID" }, "productLocationTextId": { "type": "string", "description": "Warehouse location full path\n            Use a backslash (\\) as a separator, for example:  M1\\Section name\\Location name\n            If location_id parameter is provided, the full warehouse location path will not be taken into account" }, "alwaysReturnProductShopSizesAttributes": { "type": "boolean", "description": "Return all size attributes regardless of whether product prices are the same as the base price or if they differ from it.\n                Available values:\n                1 - all size attributes will be returned;\n                0 - only attributes of those sizes, where the prices will be different from the base price (default value) will be returned." }, "returnEmptyStocksWithReservation": { "type": "boolean", "description": "Returns reservation information regardless of inventory levels" }, "picturesData": { "type": "object", "description": "Data for operations on individual photos", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "serviceId": { "type": "number", "description": "External service identifier" } } }, "responsibleProducerCode": { "type": "string", "description": "Responsible producer code" }, "responsiblePersonCode": { "type": "string", "description": "Responsible person code" } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/products/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_productsToFacebookCatalog_delete_post", {
    name: "products_productsToFacebookCatalog_delete_post",
    description: `The method allows you to add products to the Facebook catalog.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "facebookCatalogId": { "type": "number", "description": "You can read the Facebook Catalog ID in the Marketing & Integrations/Facebook/Facebook Product Catalog admin panel" }, "shopId": { "type": "number", "description": "Shop Id" }, "products": { "type": "array", "description": "Products list.", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/productsToFacebookCatalog/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_productsToFacebookCatalog_get", {
    name: "products_productsToFacebookCatalog_get",
    description: `The method allows you to retrieve products assigned to the Facebook catalog.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "facebookCatalogId": { "type": "number", "description": "You can read the Facebook Catalog ID in the Marketing & Integrations/Facebook/Facebook Product Catalog admin panel" }, "shopId": { "type": "number", "description": "Shop Id" } }, "required": ["facebookCatalogId", "shopId"] },
    method: "get",
    pathTemplate: "/products/productsToFacebookCatalog",
    executionParameters: [{ "name": "facebookCatalogId", "in": "query" }, { "name": "shopId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_productsToFacebookCatalog_post", {
    name: "products_productsToFacebookCatalog_post",
    description: `The method allows you to add products to the Facebook catalog.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "facebookCatalogId": { "type": "number", "description": "You can read the Facebook Catalog ID in the Marketing & Integrations/Facebook/Facebook Product Catalog admin panel" }, "shopId": { "type": "number", "description": "Shop Id" }, "products": { "type": "array", "description": "Products list.", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/productsToFacebookCatalog",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_productsToPromotion_delete_post", {
    name: "products_productsToPromotion_delete_post",
    description: `The method allows to remove the products from the promotion.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "promotionId": { "type": "number", "description": "Special offer ID" }, "products": { "type": "array", "description": "Products list.", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/productsToPromotion/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_productsToPromotion_post", {
    name: "products_productsToPromotion_post",
    description: `The method allows to add products to an existing special offer.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "promotionId": { "type": "number", "description": "Special offer ID" }, "products": { "type": "array", "description": "Products list.", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/productsToPromotion",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_questions_get", {
    name: "products_questions_get",
    description: `The method allows you to download a list of questions to products available in the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "number", "description": "Question ID." }, "productId": { "type": "number", "description": "Product IAI code" } } },
    method: "get",
    pathTemplate: "/products/questions",
    executionParameters: [{ "name": "id", "in": "query" }, { "name": "productId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_questions_put", {
    name: "products_questions_put",
    description: `The method allows you to add and edit questions to products available in the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "questions": { "type": "array", "description": "Question Board.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Question ID." }, "lang": { "type": "string", "description": "Language of the question e.g. 'pol', 'eng'." }, "question": { "type": "string", "description": "Your question(base64)." }, "answer": { "type": "string", "description": "Content of the answer(base64)." }, "dateAdd": { "type": "string", "description": "The date the question was created." }, "host": { "type": "string", "description": "The name and address of the host from which the question was added." }, "author": { "type": "string", "description": "Author." }, "productIdent": { "type": "object", "description": "Stock keeping unit.", "properties": { "productId": { "type": "string", "description": "Product IAI code" }, "productIdentType": { "type": "string", "description": "Identifier type.", "enum": ["id", "codeExtern", "codeProducer"] } } }, "visible": { "type": "string", "description": "Visibility:\n                \"y\" - yes,\n                \"n\" - no", "enum": ["n", "y"] }, "priority": { "type": "number", "description": "Priority." }, "confirmed": { "type": "string", "description": "Validate the question:\n                \"y\" - yes,\n                \"n\" - no", "enum": ["n", "y"] }, "shopId": { "type": "number", "description": "Shop Id" }, "answerDate": { "type": "string", "description": "Date of response." }, "answerAuthor": { "type": "string", "description": "Response author." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/questions",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_reservations_get", {
    name: "products_reservations_get",
    description: `It allows to download information about product reservations in orders (for up to 100 products in one request).
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "products": { "type": "array", "description": "Products list.", "items": { "type": "string", "description": "ID value." } } } },
    method: "get",
    pathTemplate: "/products/reservations",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "products", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_restore_post", {
    name: "products_restore_post",
    description: `The method is used to restore deleted products
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/restore",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_series_delete_post", {
    name: "products_series_delete_post",
    description: `Method allows you to delete a series of products available in the IdoSell administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "ids": { "type": "array", "description": "IDs", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/series/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_series_filter_get", {
    name: "products_series_filter_get",
    description: `Method allows you to retrieve a list of filters for a series of products available in the IdoSell administration panel..
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "serieId": { "type": "number", "description": "Series Id" } }, "required": ["shopId", "languageId", "serieId"] },
    method: "get",
    pathTemplate: "/products/series/filter",
    executionParameters: [{ "name": "shopId", "in": "query" }, { "name": "languageId", "in": "query" }, { "name": "serieId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_series_filter_put", {
    name: "products_series_filter_put",
    description: `The method allows you to manage the filter settings for the series..
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "languageId": { "type": "string", "description": "Language ID (code in ISO 639-2)." }, "serieId": { "type": "number", "description": "Series Id" }, "filterForNodeIsDefault": { "type": "string", "description": "", "enum": ["y", "n"] }, "filtersActive": { "type": "array", "description": "Active filters.", "items": { "type": "object", "properties": { "filterId": { "type": "string", "description": "Menu filter ID." }, "filterName": { "type": "string", "description": "Filter name on page." }, "filterDisplay": { "type": "string", "description": "Display as: \"name\" - text, \"gfx\" - graphics, \"namegfx\" - text and graphics.", "enum": ["name", "gfx", "namegfx"] }, "filterValueSort": { "type": "string", "description": "Sort by: \"y\" - alfabetically, \"n\" - by frequency and order of occurrence of indicated parameter value in found products, \"priority\" - according to value sequence in parameter.", "enum": ["y", "n", "priority"] }, "filterDefaultEnabled": { "type": "string", "description": "Enabled by default .", "enum": ["y", "n"] } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/series/filter",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_series_get", {
    name: "products_series_get",
    description: `Method returns information about the product series available in the IdoSell administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "return_last_changed_time": { "type": "string", "description": "With \"y\" value it returns the last series modification date in YYYY-MM-DD HH:MM:SS format." }, "ids": { "type": "array", "description": "IDs", "items": { "type": "number" } }, "names": { "type": "array", "description": "Names", "items": { "type": "string" } }, "languagesIds": { "type": "array", "description": "List of languages", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/products/series",
    executionParameters: [{ "name": "return_last_changed_time", "in": "query" }, { "name": "ids", "in": "query" }, { "name": "names", "in": "query" }, { "name": "languagesIds", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_series_put", {
    name: "products_series_put",
    description: `Method allows you to update information about product series available in the IdoSell administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "series": { "type": "array", "description": "Series list.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Id" }, "nameInPanel": { "type": "string", "description": "Name in panel" }, "shopsConfigurations": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "language": { "type": "string", "description": "Customer language ID." }, "nameOnPage": { "type": "string", "description": "Name on the page" }, "headerName": { "type": "string", "description": "Name displayed in the website header" }, "description": { "type": "string", "description": "Description" }, "descriptionBottom": { "type": "string", "description": "Description bottom" }, "view": { "type": "string", "description": "Products display settings", "enum": ["default", "own"] }, "enableSort": { "type": "boolean", "description": "Enable customers to change sorting" }, "enableChangeDisplayCount": { "type": "boolean", "description": "Enable customers to change the number of products displayed" }, "numberOfProductsGrid": { "type": "number", "description": "Number of displayed products" }, "sortModeGrid": { "type": "string", "description": "Selected sorting mode", "enum": ["d_relevance", "d_date", "a_date", "d_priority", "a_priority", "a_priorityname", "d_priorityname", "d_priorityonly", "a_priorityonly", "a_name", "d_name", "a_price", "d_price"] }, "imagesConfiguration": { "type": "object", "description": "", "properties": { "graphicType": { "type": "string", "description": "Type of graphics", "enum": ["img", "img_rwd"] }, "singleGraphic": { "type": "string", "description": "Image (one size for computers, tablets and smartphones, not recommended)" }, "pcGraphic": { "type": "string", "description": "Graphics for computer screens" }, "tabletGraphic": { "type": "string", "description": "Graphics for tablets" }, "phoneGraphic": { "type": "string", "description": "Graphics for smartphones" } } }, "metaSettings": { "type": "string", "description": "Meta settings", "enum": ["auto", "custom"] }, "metaTitle": { "type": "string", "description": "Title" }, "metaDescription": { "type": "string", "description": "Description" }, "metaKeywords": { "type": "string", "description": "Keywords" }, "metaRobotsSettingsIndex": { "type": "string", "description": "Meta robots settings for index attribute", "enum": ["auto", "index", "noindex"] }, "metaRobotsSettingsFollow": { "type": "string", "description": "Meta robots settings for follow attribute", "enum": ["auto", "follow", "nofollow"] } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/series",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_sizes_delete_post", {
    name: "products_sizes_delete_post",
    description: `The method is used to remove sizes
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "mode": { "type": "string", "description": "Edition mode", "enum": ["delete_by_size", "delete_all"] }, "params": { "type": "array", "description": "Parameters transmitted to method", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "sizes": { "type": "array", "description": "List of sizes", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" } } } } } } }, "deleteSizesIndexesData": { "type": "array", "description": "Product parameters recognized by index.", "items": { "type": "string" } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/sizes/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_sizes_get", {
    name: "products_sizes_get",
    description: `Method that returns information about product sizes configured in the administration panel
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "result::page": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "result::pageNumber": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/products/sizes",
    executionParameters: [{ "name": "result::page", "in": "query" }, { "name": "result::pageNumber", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_sizes_put", {
    name: "products_sizes_put",
    description: `This method allows you to edit the size-dependent data
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "mode": { "type": "string", "description": "Edition mode", "enum": ["edit", "add", "replace"] }, "sizesProductsData": { "type": "array", "description": "Product parameters recognized by product ID or its sizes", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "sizes": { "type": "array", "description": "List of sizes", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "sizePanelName": { "type": "string", "description": "Size name" }, "sizeData": { "type": "object", "description": "Parameters set for sizes.", "properties": { "productWeight": { "type": "number", "description": "Weight." }, "codeProducer": { "type": "string", "description": "Producer code" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "sitesData": { "type": "array", "description": "Parameters set for shops", "items": { "type": "object", "properties": { "siteId": { "type": "number", "description": "Page ID" }, "productPrices": { "type": "object", "description": "Prices in shops", "properties": { "productRetailPrice": { "type": "number", "description": "Gross price", "format": "float" }, "productWholesalePrice": { "type": "number", "description": "Wholesale price", "format": "float" }, "productMinimalPrice": { "type": "number", "description": "Minimal price", "format": "float" }, "productSuggestedPrice": { "type": "number", "description": "Recommended retail price", "format": "float" } } } } } } } } } } } } } }, "indexesData": { "type": "array", "description": "Product parameters recognized by index", "items": { "type": "object", "properties": { "sizeIndex": { "type": "string", "description": "Product index." }, "sizeData": { "type": "object", "description": "Parameters set for sizes.", "properties": { "productWeight": { "type": "number", "description": "Weight." }, "codeProducer": { "type": "string", "description": "Producer code" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "sitesData": { "type": "array", "description": "Parameters set for shops", "items": { "type": "object", "properties": { "siteId": { "type": "number", "description": "Page ID" }, "prices": { "type": "object", "description": "", "properties": { "productPriceRetail": { "type": "number", "description": "Retail price", "format": "float" }, "productPriceWholesale": { "type": "number", "description": "Wholesale price", "format": "float" }, "productSearchPriceMin": { "type": "number", "description": "Minimal price for product.", "format": "float" }, "productPriceSuggested": { "type": "number", "description": "Recommended retail price", "format": "float" } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/sizes",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_stockQuantity_put", {
    name: "products_stockQuantity_put",
    description: `MetodaPozwalaNaEdycjeDanychDotyczacychIlosci
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productIndex": { "type": "string", "description": "Product index" }, "productSizeCodeProducer": { "type": "string", "description": "Product size code producer" }, "productSizeCodeExternal": { "type": "string", "description": "External product system code for size." }, "stockId": { "type": "number", "description": "Stock ID" }, "productSizeQuantity": { "type": "number", "description": "Product stock quantity", "format": "float" }, "productPurchasePrice": { "type": "number", "description": "Cost price", "format": "float" }, "productPurchasePriceNet": { "type": "number", "description": "Net purchase price", "format": "float" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/stockQuantity",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_stocks_get", {
    name: "products_stocks_get",
    description: `Method that enables getting information about product stock levels and warehouse locations.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "products": { "type": "array", "description": "Products list.", "items": { "type": "string", "description": "ID value.", "properties": { "identType": { "type": "string", "description": "", "example": "identType", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value.", "example": "identValue" } } } } } },
    method: "get",
    pathTemplate: "/products/stocks",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "products", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_stocks_put", {
    name: "products_stocks_put",
    description: `Method that enables setting product stock levels and warehouse locations.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "ident": { "type": "object", "description": "", "properties": { "identType": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "sizes": { "type": "array", "description": "List of sizes", "items": { "type": "object", "properties": { "ident": { "type": "object", "description": "", "properties": { "identType": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "quantity": { "type": "object", "description": "Product quantity.", "properties": { "stocks": { "type": "array", "description": "Stock operations.", "items": { "type": "object", "properties": { "stock_id": { "type": "number", "description": "Stock ID." }, "quantity_operation": { "type": "object", "description": "", "properties": { "operation": { "type": "string", "description": "Operation type.", "enum": ["set", "add", "substract"] }, "quantity": { "type": "number", "description": "Product quantity.", "format": "float" } } }, "location_id": { "type": "number", "description": "Warehouse location ID." }, "location_text_id": { "type": "string", "description": "Warehouse location full path.\n                        Use a backslash (\\) as a separator, for example:  M1\\Section name\\Location name.\n                        If location_id parameter is provided, the full warehouse location path will not be taken into account." }, "location_code": { "type": "string", "description": "Storage location code" }, "additionalLocations": { "type": "array", "description": "Additional locations.", "items": { "type": "object", "properties": { "additionalLocationSettings": { "type": "string", "description": "Element specifying the modification mode for additional locations.\n        Available values:\n        \"add\" - assignment of additional product location,\n        \"remove\" - Remove the assignment of an additional location to the product.", "enum": ["add", "remove"] }, "additionalLocationId": { "type": "number", "description": "Warehouse location ID." }, "additionalLocationTextId": { "type": "string", "description": "Warehouse location full path." }, "additionalLocationCode": { "type": "string", "description": "Storage location code" } } } } } } } } } } } }, "settings": { "type": "object", "description": "", "properties": { "productIndent": { "type": "object", "description": "", "properties": { "identType": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "sizesIndent": { "type": "object", "description": "", "properties": { "identType": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } }, "error": { "type": "object", "description": "Error information.", "properties": { "faultCode": { "type": "number", "description": "Error code." }, "faultString": { "type": "string", "description": "Error description." } } } } } } } }, "settings": { "type": "object", "description": "", "properties": { "productIndent": { "type": "object", "description": "", "properties": { "identType": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } }, "sizesIndent": { "type": "object", "description": "", "properties": { "identType": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "identValue": { "type": "string", "description": "ID value." } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/stocks",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_strikethroughPrices_get", {
    name: "products_strikethroughPrices_get",
    description: `Allows for getting information about product strikethrough price settings
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "identType": { "type": "string", "description": "Identifier type.", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "products": { "type": "array", "description": "Products list.", "items": { "type": "string", "description": "Product identifier" } } } },
    method: "get",
    pathTemplate: "/products/strikethroughPrices",
    executionParameters: [{ "name": "identType", "in": "query" }, { "name": "products", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_strikethroughPrices_put", {
    name: "products_strikethroughPrices_put",
    description: `Allows for editing product strikethrough price settings
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "ident": { "type": "object", "description": "Identifier type.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "value": { "type": "string", "description": "Value." } } }, "sizes": { "type": "array", "description": "List of sizes", "items": { "type": "object", "properties": { "ident": { "type": "object", "description": "Identifier type.", "properties": { "type": { "type": "string", "description": "", "enum": ["id", "index", "codeExtern", "codeProducer"] }, "value": { "type": "string", "description": "Value." } } }, "stp_settings": { "type": "object", "description": "", "properties": { "price_change_mode": { "type": "string", "description": "", "enum": ["amount_set", "amount_diff", "percent_diff"] }, "price_change_basevalue": { "type": "string", "description": "", "enum": ["price", "price_minimal", "price_pos", "price_srp", "price_crossed"] }, "retail_price_change_value": { "type": "number", "description": "Strikethrough retail price value change in relation to the starting price.", "format": "float" }, "wholesale_price_change_value": { "type": "number", "description": "Strikethrough wholesale price value change in relation to the starting price.", "format": "float" } } }, "shops": { "type": "array", "description": "Strikethrough price settings for the page.", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id" }, "stp_settings": { "type": "object", "description": "", "properties": { "price_change_mode": { "type": "string", "description": "", "enum": ["amount_set", "amount_diff", "percent_diff"] }, "price_change_basevalue": { "type": "string", "description": "", "enum": ["price", "price_minimal", "price_pos", "price_srp", "price_crossed"] }, "retail_price_change_value": { "type": "number", "description": "Strikethrough retail price value change in relation to the starting price.", "format": "float" }, "wholesale_price_change_value": { "type": "number", "description": "Strikethrough wholesale price value change in relation to the starting price.", "format": "float" } } } } } } } } }, "stp_settings": { "type": "object", "description": "", "properties": { "price_change_mode": { "type": "string", "description": "", "enum": ["amount_set", "amount_diff", "percent_diff"] }, "price_change_basevalue": { "type": "string", "description": "", "enum": ["price", "price_minimal", "price_pos", "price_srp", "price_crossed"] }, "retail_price_change_value": { "type": "number", "description": "Strikethrough retail price value change in relation to the starting price.", "format": "float" }, "wholesale_price_change_value": { "type": "number", "description": "Strikethrough wholesale price value change in relation to the starting price.", "format": "float" } } }, "shops": { "type": "array", "description": "Strikethrough price settings for the page.", "items": { "type": "object", "properties": { "shop_id": { "type": "number", "description": "Shop Id" }, "stp_settings": { "type": "object", "description": "", "properties": { "price_change_mode": { "type": "string", "description": "", "enum": ["amount_set", "amount_diff", "percent_diff"] }, "price_change_basevalue": { "type": "string", "description": "", "enum": ["price", "price_minimal", "price_pos", "price_srp", "price_crossed"] }, "retail_price_change_value": { "type": "number", "description": "Strikethrough retail price value change in relation to the starting price.", "format": "float" }, "wholesale_price_change_value": { "type": "number", "description": "Strikethrough wholesale price value change in relation to the starting price.", "format": "float" } } } } } } } } } } }, "settings": { "type": "object", "description": "Settings", "properties": { "calculate_base_price_sizes": { "type": "string", "description": "", "enum": ["all", "available"] }, "price_mode": { "type": "string", "description": "", "enum": ["gross", "net"] }, "price_round_mode": { "type": "string", "description": "", "enum": ["none", "00", "x0", "99", "x9"] } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/strikethroughPrices",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_supplierCode_put", {
    name: "products_supplierCode_put",
    description: `The method allows to edit supplier data in the IdoSell Shop administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productDeliverers": { "type": "array", "description": "Suppliers data", "items": { "type": "object", "properties": { "delivererId": { "type": "number", "description": "Supplier ID." }, "productSizes": { "type": "array", "description": "Sizes available for products data.", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "sizeDelivererCode": { "type": "string", "description": "Supplier code for size" } } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/supplierCode",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_supplierProductData_put", {
    name: "products_supplierProductData_put",
    description: `The method allows you to edit the commodity data related to its suppliers.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "productId": { "type": "number", "description": "Product IAI code" }, "productDeliverers": { "type": "array", "description": "Suppliers data", "items": { "type": "object", "properties": { "delivererId": { "type": "number", "description": "Supplier ID." }, "productSizes": { "type": "array", "description": "Sizes available for products data.", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "sizeDelivererCode": { "type": "string", "description": "Supplier code" }, "quantity": { "type": "number", "description": "Supplier's stock level ", "format": "float" }, "lastPrice": { "type": "number", "description": "Last purchase price", "format": "float" }, "lastPriceNet": { "type": "number", "description": "Last net purchase price", "format": "float" } } } }, "clearAllQuantities": { "type": "boolean", "description": "#!UstawieniePozwalaWyzerowacStanyMagazynowegoDostawcyDlaWszystkichRozmiarowDanegoProduktu!#" } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/supplierProductData",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_synchronization_file_post", {
    name: "products_synchronization_file_post",
    description: `The method allows you to upload to the goods synchronization module, the offer in a file in IOF 3.0 format.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "synchronizationId": { "type": "number", "description": "Synchronization ID." }, "packageId": { "type": "number", "description": "File package number. Leave blank for the first file in the package, and the API will return a generated number, which should then be transmitted and by which the API will recognize subsequent files for this package." }, "fileType": { "type": "string", "description": "File Type IOF30 (full/light/categories/sizes/series/guarantees/parameters)." }, "md5Content": { "type": "string", "description": "MD5 from the file avarage before base64 encoding." }, "fileContent": { "type": "string", "description": "Offer file encoded with base64 algorithm." }, "offerName": { "type": "string", "description": "Unique offer name." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/products/synchronization/file",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["products_synchronization_finishUpload_put", {
    name: "products_synchronization_finishUpload_put",
    description: `Method informs commodity synchronization module that uploading of files is complete.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "synchronizationId": { "type": "number", "description": "Synchronization ID." }, "packageId": { "type": "number", "description": "File package number." }, "filesInPackage": { "type": "number", "description": "Total number of files in the parcel." }, "verifyFiles": { "type": "boolean", "description": "Whether to verify the package by sparsifying files and preparing requests. It may take a few minutes to answer." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/products/synchronization/finishUpload",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_elements_add_post", {
    name: "promotions_elements_add_post",
    description: `Adds elements to promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "properties": { "elements": { "description": "Array of PromotionElement objects", "type": "array", "items": { "properties": { "id": { "description": "ID", "type": "string" }, "type": { "description": "Promotion element type", "type": "string", "enum": ["product", "series", "producer", "category", "menu"] }, "name": { "description": "Promotion element name", "type": "string" }, "promotionId": { "description": "Promotion ID", "type": "number" }, "correlatedElementsId": { "description": "Correlated elements id eg. product versions id", "type": "array", "items": { "type": "number" } } }, "type": "object", "title": "PromotionElement", "x-readme-ref-name": "PromotionElement" } } }, "type": "object", "title": "PromotionElements", "x-readme-ref-name": "PromotionElements" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/promotions/elements/add",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_elements_list_post", {
    name: "promotions_elements_list_post",
    description: `List of promotions elements
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Object describing the request for a list of promotions elements", "properties": { "filter": { "properties": { "ids": { "description": "Elements IDs", "type": "array", "items": { "type": "string" } }, "types": { "description": "Element types", "type": "array", "items": { "type": "string", "enum": ["product", "series", "producer", "category", "menu"] } }, "promotionIds": { "description": "Promotion IDs", "type": "array", "items": { "type": "number" } } }, "type": "object", "title": "ElementsViewFilter", "x-readme-ref-name": "ElementsViewFilter" }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" }, "orderBy": { "description": "Order by settings.", "properties": { "property": { "description": "A property for sorting the results.", "type": "string", "default": "promotion_id", "enum": ["promotion_id", "type", "element_id"] }, "orderByDirection": { "description": "Order direction.", "type": "string", "default": "desc", "enum": ["asc", "desc"] } }, "type": "object", "title": "ElementsViewOrderBy", "x-readme-ref-name": "ElementsViewOrderBy" } }, "type": "object", "title": "ElementsViewRequest", "x-readme-ref-name": "ElementsViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/promotions/elements/list",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_elements_remove_post", {
    name: "promotions_elements_remove_post",
    description: `Removes elements from promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "properties": { "elements": { "description": "Array of PromotionElement objects", "type": "array", "items": { "properties": { "id": { "description": "ID", "type": "string" }, "type": { "description": "Promotion element type", "type": "string", "enum": ["product", "series", "producer", "category", "menu"] }, "name": { "description": "Promotion element name", "type": "string" }, "promotionId": { "description": "Promotion ID", "type": "number" }, "correlatedElementsId": { "description": "Correlated elements id eg. product versions id", "type": "array", "items": { "type": "number" } } }, "type": "object", "title": "PromotionElement", "x-readme-ref-name": "PromotionElement" } } }, "type": "object", "title": "PromotionElements", "x-readme-ref-name": "PromotionElements" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/promotions/elements/remove",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_history_get_post", {
    name: "promotions_history_get_post",
    description: `Get a single promotion history
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Object describing the request for a list of promotion history elements", "properties": { "filter": { "description": "Filters that limit the result of a customer query.", "required": ["promotionId"], "properties": { "promotionId": { "description": "Promotion ID", "type": "number" } }, "type": "object", "title": "HistoryViewFilter", "x-readme-ref-name": "HistoryViewFilter" }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" } }, "type": "object", "title": "HistoryViewRequest", "x-readme-ref-name": "HistoryViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/promotions/history/get",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotions_add_post", {
    name: "promotions_promotions_add_post",
    description: `Add a promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "required": ["newPriceValue", "activeInShops"], "allOf": [{ "properties": { "promotionId": { "description": "ID of promotion", "type": "integer", "readOnly": true, "example": 23 }, "name": { "description": "Promotion name", "type": "string", "minLength": 1, "example": "Summer sale" }, "activeInShops": { "description": "Array of shop ids", "type": "array", "items": { "type": "integer" }, "minItems": 1, "example": [1, 3] }, "types": { "description": "Promotion zones", "type": "array", "items": { "type": "string", "enum": ["promotion", "special", "discount", "distinguished", "bestseller", "new"] }, "minItems": 1, "example": ["promotion", "special", "discount", "distinguished", "bestseller", "new"] }, "startTime": { "description": "Promotion start datetime", "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$", "example": "2025-05-05 07:15:28" }, "endTime": { "description": "Promotion end datetime", "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$", "example": "2026-05-05 21:45:00" }, "changeVisibility": { "description": "Change visibility", "type": "boolean", "example": true }, "autoUnpin": { "description": "Auto unpin", "type": "boolean", "example": true }, "autoUnpinOwnStocks": { "description": "Auto unpin own stocks", "type": "boolean", "example": true }, "priceType": { "description": "Price type", "type": "string", "enum": ["retail", "wholesale", "pos"], "example": "retail" }, "newPriceValue": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$", "example": "0.01", "nullable": false } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "currency": { "description": "Currency", "type": "string", "example": "PLN" }, "newPriceDiscountType": { "description": "Discount type", "type": "string", "enum": ["percent", "minus", "set"], "example": "percent" }, "newPriceRound": { "description": "New price round", "type": "string", "enum": ["whole", "first", "second"], "example": "first" }, "newPriceEnd": { "description": "New price end", "type": "integer", "minimum": 0, "example": 0 }, "netGross": { "description": "Net or gross", "type": "string", "enum": ["gross", "net"], "example": "gross" }, "chargeType": { "description": "Charge type", "type": "string", "enum": ["lowest", "sum"], "example": "lowest" }, "enableInMarketplaces": { "description": "Enable in marketplaces", "type": "string", "enum": ["y", "n", "yes_for_dynamic_pricing_products"], "example": "n" }, "status": { "description": "Status", "type": "string", "enum": ["waiting", "active", "closed"], "example": "active" }, "elementsModificationDate": { "description": "Elements modification date", "type": "string", "readOnly": true, "example": "2025-01-02", "nullable": true }, "archivedDate": { "description": "Promotion archive datetime", "type": "string", "readOnly": true, "example": "2025-04-01 12:00:19", "nullable": true }, "elementsCount": { "description": "Promotion elements count", "type": "object", "readOnly": true, "example": { "products": 1 } }, "elements": { "description": "Promotion elements", "type": "array", "readOnly": true } }, "type": "object", "title": "PromotionData", "x-readme-ref-name": "PromotionData" }], "title": "PromotionDataAdd", "x-readme-ref-name": "PromotionDataAdd" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/promotions/promotions/add",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotions_delete_delete", {
    name: "promotions_promotions_delete_delete",
    description: `Deleting promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "promotionId": { "type": "number" } }, "required": ["promotionId"] },
    method: "delete",
    pathTemplate: "/promotions/promotions/delete",
    executionParameters: [{ "name": "promotionId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotions_edit_put", {
    name: "promotions_promotions_edit_put",
    description: `Editing promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "type": "object", "allOf": [{ "properties": { "promotionId": { "description": "ID of promotion", "type": "integer", "readOnly": true, "example": 23 }, "name": { "description": "Promotion name", "type": "string", "minLength": 1, "example": "Summer sale" }, "activeInShops": { "description": "Array of shop ids", "type": "array", "items": { "type": "integer" }, "minItems": 1, "example": [1, 3] }, "types": { "description": "Promotion zones", "type": "array", "items": { "type": "string", "enum": ["promotion", "special", "discount", "distinguished", "bestseller", "new"] }, "minItems": 1, "example": ["promotion", "special", "discount", "distinguished", "bestseller", "new"] }, "startTime": { "description": "Promotion start datetime", "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$", "example": "2025-05-05 07:15:28" }, "endTime": { "description": "Promotion end datetime", "type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$", "example": "2026-05-05 21:45:00" }, "changeVisibility": { "description": "Change visibility", "type": "boolean", "example": true }, "autoUnpin": { "description": "Auto unpin", "type": "boolean", "example": true }, "autoUnpinOwnStocks": { "description": "Auto unpin own stocks", "type": "boolean", "example": true }, "priceType": { "description": "Price type", "type": "string", "enum": ["retail", "wholesale", "pos"], "example": "retail" }, "newPriceValue": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$", "example": "0.01", "nullable": false } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "currency": { "description": "Currency", "type": "string", "example": "PLN" }, "newPriceDiscountType": { "description": "Discount type", "type": "string", "enum": ["percent", "minus", "set"], "example": "percent" }, "newPriceRound": { "description": "New price round", "type": "string", "enum": ["whole", "first", "second"], "example": "first" }, "newPriceEnd": { "description": "New price end", "type": "integer", "minimum": 0, "example": 0 }, "netGross": { "description": "Net or gross", "type": "string", "enum": ["gross", "net"], "example": "gross" }, "chargeType": { "description": "Charge type", "type": "string", "enum": ["lowest", "sum"], "example": "lowest" }, "enableInMarketplaces": { "description": "Enable in marketplaces", "type": "string", "enum": ["y", "n", "yes_for_dynamic_pricing_products"], "example": "n" }, "status": { "description": "Status", "type": "string", "enum": ["waiting", "active", "closed"], "example": "active" }, "elementsModificationDate": { "description": "Elements modification date", "type": "string", "readOnly": true, "example": "2025-01-02", "nullable": true }, "archivedDate": { "description": "Promotion archive datetime", "type": "string", "readOnly": true, "example": "2025-04-01 12:00:19", "nullable": true }, "elementsCount": { "description": "Promotion elements count", "type": "object", "readOnly": true, "example": { "products": 1 } }, "elements": { "description": "Promotion elements", "type": "array", "readOnly": true } }, "type": "object", "title": "PromotionData", "x-readme-ref-name": "PromotionData" }, { "properties": { "promotionId": { "description": "ID of promotion", "type": "integer", "readOnly": false, "example": 23 } } }], "title": "PromotionDataEdit", "x-readme-ref-name": "PromotionDataEdit" } }, "type": "object", "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/promotions/promotions/edit",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotions_end_post", {
    name: "promotions_promotions_end_post",
    description: `Closing promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "required": ["promotionId"], "properties": { "promotionId": { "description": "ID of promotion", "type": "number" } }, "type": "object", "title": "PromotionIdDTO", "x-readme-ref-name": "PromotionIdDTO", "description": "The JSON request body." } }, "required": ["requestBody"] },
    method: "post",
    pathTemplate: "/promotions/promotions/end",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotions_get_get", {
    name: "promotions_promotions_get_get",
    description: `Get a single promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "promotionId": { "type": "number" } }, "required": ["promotionId"] },
    method: "get",
    pathTemplate: "/promotions/promotions/get",
    executionParameters: [{ "name": "promotionId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotions_listView_list_post", {
    name: "promotions_promotions_listView_list_post",
    description: `List of promotions of the store. Allows you to download data for editing and basic statistics.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Object describing the request for a list of Promotions", "properties": { "filter": { "description": "Filters that limit the result of a customer query.", "properties": { "ids": { "description": "Promotion ID", "type": ["array", "null"], "items": { "type": "integer" } }, "name": { "description": "Promotion name", "type": "string" }, "changeVisibility": { "description": "Change visibility", "type": "boolean" }, "activeInShops": { "description": "Array of shop ids", "type": "array", "items": { "type": "number" } }, "types": { "description": "Promotion zones", "type": "array", "items": { "type": "string", "enum": ["promotion", "special", "discount", "distinguished", "bestseller", "new"] } }, "priceTypes": { "description": "Price types", "type": "array", "items": { "type": "string", "enum": ["retail", "wholesale", "pos"] } }, "statuses": { "description": "Promotion statuses", "type": "array", "items": { "type": "string", "enum": ["waiting", "active", "closed"] } }, "dateRange": { "description": "Date range", "oneOf": [{ "description": "Universal structure for intervals.", "properties": { "from": { "description": "Date “from” (RFC)", "type": "string", "format": "date", "example": "2023-01-01", "nullable": true }, "to": { "description": "Data \"do\" (RFC)", "type": "string", "format": "date", "example": "2023-01-07", "nullable": true } }, "type": "object", "title": "DateRange", "x-readme-ref-name": "DateRange" }], "type": "null" }, "productsNotInPromotion": { "description": "Array of products in promotion", "type": ["array", "null"], "items": { "type": "integer" } } }, "type": "object", "title": "PromotionsViewFilter", "x-readme-ref-name": "PromotionsViewFilter" }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" }, "orderBy": { "description": "Order by settings.", "properties": { "property": { "description": "A property for sorting the results.", "type": "string", "default": "id", "enum": ["id", "name", "start_time", "end_time", "new_price_value", "new_price_end", "elements_modification_date"] }, "orderByDirection": { "description": "Order direction.", "type": "string", "default": "desc", "enum": ["asc", "desc"] } }, "type": "object", "title": "PromotionsViewOrderBy", "x-readme-ref-name": "PromotionsViewOrderBy" } }, "type": "object", "title": "PromotionsViewRequest", "x-readme-ref-name": "PromotionsViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/promotions/promotions/listView/list",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotions_start_post", {
    name: "promotions_promotions_start_post",
    description: `Starting promotion
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "required": ["promotionId"], "properties": { "promotionId": { "description": "ID of promotion", "type": "number" } }, "type": "object", "title": "PromotionIdDTO", "x-readme-ref-name": "PromotionIdDTO", "description": "The JSON request body." } }, "required": ["requestBody"] },
    method: "post",
    pathTemplate: "/promotions/promotions/start",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotionsArchive_delete_delete", {
    name: "promotions_promotionsArchive_delete_delete",
    description: `Removes promotion from archive
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "promotionId": { "type": "number" } }, "required": ["promotionId"] },
    method: "delete",
    pathTemplate: "/promotions/promotionsArchive/delete",
    executionParameters: [{ "name": "promotionId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotionsArchive_get_get", {
    name: "promotions_promotionsArchive_get_get",
    description: `Get a single promotion from archive
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "promotionId": { "type": "number" } }, "required": ["promotionId"] },
    method: "get",
    pathTemplate: "/promotions/promotionsArchive/get",
    executionParameters: [{ "name": "promotionId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_promotionsArchive_list_post", {
    name: "promotions_promotionsArchive_list_post",
    description: `Archived promotions list
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Object describing the request for a list of archive promotions", "properties": { "filter": { "description": "Filters that limit the result of a customer query.", "properties": { "shops": { "description": "Shops IDs", "type": "array", "items": { "type": "number" } }, "archivedDate": { "oneOf": [{ "description": "Universal structure for intervals.", "properties": { "from": { "description": "Date “from” (RFC)", "type": "string", "format": "date", "example": "2023-01-01", "nullable": true }, "to": { "description": "Data \"do\" (RFC)", "type": "string", "format": "date", "example": "2023-01-07", "nullable": true } }, "type": "object", "title": "DateRange", "x-readme-ref-name": "DateRange" }], "type": "null" } }, "type": "object", "title": "PromotionsArchiveViewFilter", "x-readme-ref-name": "PromotionsArchiveViewFilter" }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" }, "orderBy": { "description": "Order by settings.", "properties": { "property": { "description": "A property for sorting the results.", "type": "string", "default": "id", "enum": ["id", "shop_mask", "archived_date"] }, "orderByDirection": { "description": "Order direction.", "type": "string", "default": "desc", "enum": ["asc", "desc"] } }, "type": "object", "title": "PromotionsArchiveViewOrderBy", "x-readme-ref-name": "PromotionsArchiveViewOrderBy" } }, "type": "object", "title": "PromotionsArchiveViewRequest", "x-readme-ref-name": "PromotionsArchiveViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/promotions/promotionsArchive/list",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_settings_get_get", {
    name: "promotions_settings_get_get",
    description: `Get promotion module configuration
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/promotions/settings/get",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["promotions_settings_set_put", {
    name: "promotions_settings_set_put",
    description: `Promotion module configuration setter
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "properties": { "daysLeftToArchive": { "description": "Days to archive", "type": "number", "minimum": 30 }, "daysLeftToRemove": { "description": "Days to remove from archive", "type": "number", "minimum": 30 }, "showPriceOnProductsList": { "description": "Show promo price on products list", "type": "number", "maximum": 1, "minimum": 0 }, "automaticallySuggestDefaultStartDate": { "description": "Automatically suggest default start date", "type": "string", "enum": ["on", "off"] }, "automaticallySuggestDefaultEndDate": { "description": "Automatically suggest default end date", "type": "string", "enum": ["on", "off"] }, "defaultStartDate": { "description": "Default start date", "type": "number", "maximum": 10, "minimum": 0 }, "defaultEndDate": { "description": "Default end date", "type": "number", "maximum": 10, "minimum": 0 }, "defaultStartTime": { "description": "Default start time", "type": "number", "maximum": 23, "minimum": 0 }, "defaultEndTime": { "description": "Default end time", "type": "number", "maximum": 23, "minimum": 0 }, "daysLeftToClose": { "description": "Days to automatically close empty promotions", "type": "number", "minimum": 10 } }, "type": "object", "title": "PromotionSettings", "x-readme-ref-name": "PromotionSettings" } }, "type": "object", "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/promotions/settings/set",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["refunds_addAutomaticRefund_", {
    name: "refunds_addAutomaticRefund_",
    description: `Method allows you to add automatic refund of payments for returns and rma.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Source type.:\n                \"return\"\n                \"rma\".", "enum": ["return", "rma"] }, "sourceId": { "type": "number", "description": "Source ID." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/refunds/addAutomaticRefund",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_addAutomaticRefundForOrder_", {
    name: "refunds_addAutomaticRefundForOrder_",
    description: `Method allows you to add automatic refund for order.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceId": { "type": "number", "description": "Source ID." }, "refundValue": { "type": "number", "description": "Amount.", "format": "float" }, "paymentId": { "type": "number", "description": "Payment ID." }, "refundCurrency": { "type": "string", "description": "Payment currency." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/refunds/addAutomaticRefundForOrder",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_addManualRefund_", {
    name: "refunds_addManualRefund_",
    description: `Method allows you to add manual refund for return and rma.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Source type.:\n                \"order\"\n                \"return\"\n                \"rma\".", "enum": ["order", "return", "rma"] }, "sourceId": { "type": "number", "description": "Source ID." }, "refundValue": { "type": "number", "description": "Amount.", "format": "float" }, "refundCurrency": { "type": "string", "description": "Payment currency." }, "refundDetails": { "type": "object", "description": "", "properties": { "paymentFormId": { "type": "number", "description": "Payment method ID." }, "paymentSystem": { "type": "number", "description": "Payment system ID." }, "account": { "type": "string", "description": "Account number." }, "clientAccount": { "type": "string", "description": "Client account number." } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/refunds/addManualRefund",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_cancelRefund_", {
    name: "refunds_cancelRefund_",
    description: `Method allows you to cancel refund.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Source type.:\n        \"order\"\n        \"return\"\n        \"rma\".", "enum": ["order", "return", "rma"] }, "sourceId": { "type": "number", "description": "Source ID." }, "paymentId": { "type": "string", "description": "Payment ID." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/refunds/cancelRefund",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_confirmRefund_", {
    name: "refunds_confirmRefund_",
    description: `Method allows you to confirm refund.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Source type.:\n        \"order\" ,\n        \"return\"\n        \"rma\".", "enum": ["order", "return", "rma"] }, "sourceId": { "type": "number", "description": "Source ID." }, "paymentId": { "type": "number", "description": "Payment ID." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/refunds/confirmRefund",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_getPossibleAutoRefunds_", {
    name: "refunds_getPossibleAutoRefunds_",
    description: `Method returns Automatic refunds possible.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "sourceId": { "type": "number", "description": "Source ID" }, "sourceType": { "type": "string", "description": "Source type.", "enum": ["order", "return", "rma"] } }, "required": ["sourceId", "sourceType"] },
    method: "get",
    pathTemplate: "/refunds/getPossibleAutoRefunds",
    executionParameters: [{ "name": "sourceId", "in": "query" }, { "name": "sourceType", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_getRefundStatus_", {
    name: "refunds_getRefundStatus_",
    description: `Method returns refund status.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "sourceId": { "type": "number", "description": "Source ID" }, "paymentId": { "type": "number", "description": "Payment ID." }, "sourceType": { "type": "string", "description": "Source type.", "enum": ["order", "return", "rma"] } }, "required": ["sourceId", "paymentId", "sourceType"] },
    method: "get",
    pathTemplate: "/refunds/getRefundStatus",
    executionParameters: [{ "name": "sourceId", "in": "query" }, { "name": "paymentId", "in": "query" }, { "name": "sourceType", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_retrieveRefundsList_", {
    name: "refunds_retrieveRefundsList_",
    description: `Method returns a list of incomplete refunds.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "sourceType": { "type": "string", "description": "Source type.", "enum": ["order", "return", "rma", "all"] }, "resultsPage": { "type": "number", "description": "Page number, first 1" }, "resultsLimit": { "type": "number", "description": "Limit results, between 1 - 100" } }, "required": ["sourceType"] },
    method: "get",
    pathTemplate: "/refunds/retrieveRefundsList",
    executionParameters: [{ "name": "sourceType", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["refunds_updateRefund_", {
    name: "refunds_updateRefund_",
    description: `Method allows you to update refund.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "sourceType": { "type": "string", "description": "Source type.:\n                \"order\" ,\n                \"return\"\n                \"rma\".", "enum": ["order", "return", "rma"] }, "sourceId": { "type": "number", "description": "Source ID." }, "paymentId": { "type": "string", "description": "Payment ID." }, "refundValue": { "type": "number", "description": "Amount.", "format": "float" }, "refundCurrency": { "type": "string", "description": "Payment currency." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/refunds/updateRefund",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["regulations_history_get", {
    name: "regulations_history_get",
    description: `This call returns a history of regulations.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "type": { "type": "string", "description": "Type of history", "items": { "type": "string", "enum": ["regulation", "privacy", "dataProcessing", "cooperatingServices", "returns", "termsToplayer"], "example": "regulation" } }, "shopId": { "type": "number", "description": "Shop's ID" }, "country": { "type": "string", "description": "Country ISO code" }, "langId": { "type": "string", "description": "Language ISO code" }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } } },
    method: "get",
    pathTemplate: "/regulations/history",
    executionParameters: [{ "name": "type", "in": "query" }, { "name": "shopId", "in": "query" }, { "name": "country", "in": "query" }, { "name": "langId", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["responsibility_entities_get", {
    name: "responsibility_entities_get",
    description: `This call returns a list of responsible entities.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "code": { "type": "array", "description": "List of codes", "items": { "type": "string" } }, "type": { "type": "string", "description": "Type of entity", "items": { "type": "string", "enum": ["producer", "person"] } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } } },
    method: "get",
    pathTemplate: "/responsibility/entities",
    executionParameters: [{ "name": "code", "in": "query" }, { "name": "type", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["responsibility_entities_put", {
    name: "responsibility_entities_put",
    description: `Use this operation to update responsible entities.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "entities": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["code"], "allOf": [{ "properties": { "id": { "description": "Identificator of the entity.", "type": "integer" }, "code": { "description": "Short name/code.", "type": "string" }, "name": { "description": "Full name.", "type": "string" }, "mail": { "description": "E-mail address.", "type": "string" }, "street": { "description": "Street.", "type": "string" }, "number": { "description": "Building number.", "type": "string", "nullable": true }, "subnumber": { "description": "Apartment number.", "type": "string", "nullable": true }, "zipcode": { "description": "Zipcode.", "type": "string" }, "city": { "description": "City.", "type": "string" }, "country": { "description": "2-letter ISO country code.", "type": "string" }, "phone": { "description": "Phone number.", "type": "string", "nullable": true }, "description": { "description": "Additional description.", "type": "string", "nullable": true }, "url": { "description": "URL to contact page.", "type": "string", "nullable": true } }, "type": "object" }] } }, "type": { "type": "string", "description": "Type of entity", "example": "producer", "enum": ["producer", "person"] } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/responsibility/entities",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["responsibility_entities_post", {
    name: "responsibility_entities_post",
    description: `Use this operation to create responsible entities.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "entities": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["code", "name", "mail", "street", "zipcode", "city", "country"], "allOf": [{ "properties": { "id": { "description": "Identificator of the entity.", "type": "integer" }, "code": { "description": "Short name/code.", "type": "string" }, "name": { "description": "Full name.", "type": "string" }, "mail": { "description": "E-mail address.", "type": "string" }, "street": { "description": "Street.", "type": "string" }, "number": { "description": "Building number.", "type": "string", "nullable": true }, "subnumber": { "description": "Apartment number.", "type": "string", "nullable": true }, "zipcode": { "description": "Zipcode.", "type": "string" }, "city": { "description": "City.", "type": "string" }, "country": { "description": "2-letter ISO country code.", "type": "string" }, "phone": { "description": "Phone number.", "type": "string", "nullable": true }, "description": { "description": "Additional description.", "type": "string", "nullable": true }, "url": { "description": "URL to contact page.", "type": "string", "nullable": true } }, "type": "object" }] } }, "type": { "type": "string", "description": "Type of entity", "example": "producer", "enum": ["producer", "person"] } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/responsibility/entities",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["responsibility_entities_delete", {
    name: "responsibility_entities_delete",
    description: `This call is used to remove responsible entities.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "code": { "type": "array", "description": "List of codes", "minLength": 1, "maxLength": 100, "items": { "type": "string" } }, "type": { "type": "string", "description": "Type of entity", "items": { "type": "string", "enum": ["producer", "person"] } } } },
    method: "delete",
    pathTemplate: "/responsibility/entities",
    executionParameters: [{ "name": "code", "in": "query" }, { "name": "type", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["returns_returns_get", {
    name: "returns_returns_get",
    description: `Method that enables getting information about returns issued for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "order_sn": { "type": "number", "description": "Search by the order serial number to which a return was added." }, "return_id": { "type": "number", "description": "Search by return ID." }, "return_shipping_number": { "type": "string", "description": "Search by a return shipment number from a customer to the shop ." }, "range": { "type": "object", "description": "Date range.", "properties": { "date": { "type": "object", "description": "Data for date range.", "properties": { "date_begin": { "type": "string", "description": "Beginning date in YYYY-MM-DD format." }, "date_end": { "type": "string", "description": "Ending date in YYYY-MM-DD format." }, "dates_type": { "type": "string", "description": "", "enum": ["date_add", "date_end"] } } } } }, "results_limit": { "type": "number", "description": "Number of results on page." }, "results_page": { "type": "number", "description": "Result page number." }, "status": { "type": "number", "description": "1 - Return not handled,\n                2 - Return accepted,\n                3 - Return not accepted,\n                13 - Return canceled by the customer,\n                14 - Return canceled,\n                15 - Resend the order,\n                16 - Abort resending order,\n                17 - A customer generated a return - it will be delivered personally,\n                18 - A customer generated a return - it will be sent by the customer." }, "return_ids": { "type": "array", "description": "Search by return ID.", "items": { "type": "number" } }, "stock_id": { "type": "number", "description": "Search by ID of a stock to which a return is sent." }, "bundleAsProducts": { "type": "boolean", "description": "Return a set as its constituent products" }, "shop_ids": { "type": "array", "description": "Search by ID of a shop to which a return is sent.", "items": { "type": "number", "description": "Shop identifier." } } } },
    method: "get",
    pathTemplate: "/returns/returns",
    executionParameters: [{ "name": "order_sn", "in": "query" }, { "name": "return_id", "in": "query" }, { "name": "return_shipping_number", "in": "query" }, { "name": "range", "in": "query" }, { "name": "results_limit", "in": "query" }, { "name": "results_page", "in": "query" }, { "name": "status", "in": "query" }, { "name": "return_ids", "in": "query" }, { "name": "stock_id", "in": "query" }, { "name": "bundleAsProducts", "in": "query" }, { "name": "shop_ids", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["returns_returns_put", {
    name: "returns_returns_put",
    description: `returns/returns
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "returns": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "" }, "status": { "type": "number", "description": "" }, "apiFlag": { "type": "object", "description": "Flag informing on order registration or completion in external program through API.\n Allowed values.\n \"none\" - order was not registered in external program,\n \"registered\" - order was registered in external program,\n \"realized\" - order was completed in external program,\n \"registered_pos\" - order was registered in external program,\n \"realized_pos\" - order was completed in external program.", "properties": { "flag": { "type": "string", "description": "", "enum": ["none", "registered", "registration_fault"] }, "note": { "type": "string", "description": "" } } }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "" }, "size": { "type": "string", "description": "" }, "quantity": { "type": "number", "description": "", "format": "float" }, "price": { "type": "number", "description": "Price.", "format": "float" }, "serialNumbers": { "type": "array", "description": "", "items": { "type": "string" } }, "productOrderAdditional": { "type": "string", "description": "Additional information." } } } }, "userNote": { "type": "string", "description": "" }, "clientNote": { "type": "string", "description": "Notes from customer." }, "tryCorrectInvoice": { "type": "boolean", "description": "" } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/returns/returns",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["returns_returns_post", {
    name: "returns_returns_post",
    description: `returns/returns
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "order_sn": { "type": "number", "description": "Order serial number" }, "stock_id": { "type": "number", "description": "" }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "" }, "size": { "type": "string", "description": "" }, "quantity": { "type": "number", "description": "", "format": "float" }, "price": { "type": "number", "description": "Price.", "format": "float" }, "serialNumbers": { "type": "array", "description": "", "items": { "type": "string" } }, "productOrderAdditional": { "type": "string", "description": "Additional information." } } } }, "status": { "type": "number", "description": "" }, "client_received": { "type": "boolean", "description": "" }, "change_status": { "type": "boolean", "description": "" }, "courier_id": { "type": "number", "description": "" }, "return_operator": { "type": "string", "description": "" }, "tryCorrectInvoice": { "type": "boolean", "description": "" }, "include_shipping_cost": { "type": "string", "description": "" }, "additional_payment_cost": { "type": "string", "description": "" }, "emptyReturn": { "type": "string", "description": "", "enum": ["n", "y"] } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/returns/returns",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["returns_serialNumber_put", {
    name: "returns_serialNumber_put",
    description: `Method that enables setting serial numbers for products included in returns issued for orders in the administration panel.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "return_id": { "type": "number", "description": "Return number." }, "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Product ID." }, "size": { "type": "string", "description": "Size ID." }, "serialNumbers": { "type": "array", "description": "", "items": { "type": "string" } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/returns/serialNumber",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["returns_statuses_get", {
    name: "returns_statuses_get",
    description: `Allows to download all configurable return statuses
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/returns/statuses",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["rma_rma_get", {
    name: "rma_rma_get",
    description: `This get method allows you to retrieve data about existing claims
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "rmaIds": { "type": "array", "description": "", "items": { "type": "number" } }, "stockId": { "type": "number", "description": "Stock ID" }, "operatorLogin": { "type": "string", "description": "Login of the user handling the complaint" }, "clientId": { "type": "string", "description": "Unique client's number." }, "creationDate": { "type": "object", "description": "Complaint creation date in the YYYY-MM-DD format", "properties": { "dateFrom": { "type": "string", "description": "Starting date in the YYYY-MM-DD format" }, "dateTo": { "type": "string", "description": "End date in the YYYY-MM-DD format" } } }, "modificationDate": { "type": "object", "description": "Complaint modification date in the YYYY-MM-DD format", "properties": { "dateFrom": { "type": "string", "description": "Starting date in the YYYY-MM-DD format" }, "dateTo": { "type": "string", "description": "End date in the YYYY-MM-DD format" } } }, "endDate": { "type": "object", "description": "Complaint closing date in the YYYY-MM-DD format", "properties": { "dateFrom": { "type": "string", "description": "Starting date in the YYYY-MM-DD format" }, "dateTo": { "type": "string", "description": "End date in the YYYY-MM-DD format" } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/rma/rma",
    executionParameters: [{ "name": "rmaIds", "in": "query" }, { "name": "stockId", "in": "query" }, { "name": "operatorLogin", "in": "query" }, { "name": "clientId", "in": "query" }, { "name": "creationDate", "in": "query" }, { "name": "modificationDate", "in": "query" }, { "name": "endDate", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["rma_rma_put", {
    name: "rma_rma_put",
    description: `This update method allows to update the data in existing complaints
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "rmas": { "type": "array", "description": "Complaints.", "items": { "type": "object", "properties": { "rmaId": { "type": "number", "description": "Complaint id." }, "rmaStatusId": { "type": "number", "description": "Claim status.\n            Available values:\n            15 - Complaint not confirmed by the shop service,\n            17 - The complaint has been cancelled,\n            18 - Complaint canceled by the customer,\n            14 - Complaint didn't arrive,\n            20 - Complaint not handled,\n\n            22 - Complaint rejected - no fault was found,\n            23 - Complaint rejected - the warranty period has expired,\n            24 - Complaint rejected - defect caused by improper use,\n\n            19 - Complaint confirmed,\n\n            28 - Complaint is being considered - repair completed,\n            5 - Complaint is being considered - Product sent to the producer ,\n            4 - Complaint is being considered - Product was sent for testing,\n            6 - Complaint is being considered - Repair in progress,\n            29 - Complaint is being considered - the complaint requires additional information from the customer,\n\n            7 - Complaint adjusted negatively - no fault was found,\n            9 - Complaint adjusted negatively - the warranty period has expired,\n            30 - Complaint adjusted negatively - return shipment sent to the customer,\n            8 - Complaint adjusted negatively - defect caused by improper use,\n\n            25 - Complaint handled positively  - return shipment sent to the customer,\n            12 - Complaint handled positively  - replacement for a new product,\n            13 - Complaint handled positively  - replacement for a different product,\n            26 - Complaint handled positively  - a new item was shipped without waiting for the original one,\n            27 - Complaint handled positively  - the recipient's data change on the sales document,\n            10 - Complaint handled positively  - Refund - payment processing,\n            11 - Complaint handled positively  - repair completed - payout made,\n            31 - Complaint handled positively  - Awaiting correction invoice confirmation,\n            34 - Complaint handled positively  - Refund - preparing correction invoice" }, "rmaChat": { "type": "array", "description": "Customer correspondence.", "items": { "type": "object", "properties": { "message": { "type": "string", "description": "Message content" } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/rma/rma",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["rma_statuses_get", {
    name: "rma_statuses_get",
    description: `Allows to download all possible complaint statuses
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/rma/statuses",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["shops_currencies_get", {
    name: "shops_currencies_get",
    description: `Method is used for extracting information about a shop language templates.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/shops/currencies",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["shops_languages_get", {
    name: "shops_languages_get",
    description: `Method is used for extracting information about a shop language templates.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/shops/languages",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["sizecharts_sizecharts_delete_post", {
    name: "sizecharts_sizecharts_delete_post",
    description: `The method allows the removal of size charts.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "ids": { "type": "array", "description": "#!identyfikatory!#", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/sizecharts/sizecharts/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["sizecharts_sizecharts_get", {
    name: "sizecharts_sizecharts_get",
    description: `The method allows size charts to be downloaded.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "ids": { "type": "array", "description": "IDs", "items": { "type": "number" } }, "names": { "type": "array", "description": "Names of size charts", "items": { "type": "string" } }, "languages": { "type": "array", "description": "List of languages", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/sizecharts/sizecharts",
    executionParameters: [{ "name": "ids", "in": "query" }, { "name": "names", "in": "query" }, { "name": "languages", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["sizecharts_sizecharts_put", {
    name: "sizecharts_sizecharts_put",
    description: `The method allows the size charts settings to be updated.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "sizeCharts": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Id" }, "nameInPanel": { "type": "string", "description": "Name in panel" }, "displayMode": { "type": "string", "description": "Display mode", "enum": ["single", "all"] }, "languagesData": { "type": "array", "description": "", "items": { "type": "object", "properties": { "language": { "type": "string", "description": "Customer language ID." }, "columns": { "type": "array", "description": "", "items": { "type": "object", "properties": { "columnNumber": { "type": "number", "description": "Column number" }, "columnTitle": { "type": "string", "description": "Column name" } } } }, "sizes": { "type": "array", "description": "List of sizes", "items": { "type": "object", "properties": { "sizeId": { "type": "string", "description": "Size identifier" }, "priority": { "type": "number", "description": "Priority" }, "descriptions": { "type": "array", "description": "", "items": { "type": "object", "properties": { "columnNumber": { "type": "number", "description": "Column number" }, "value": { "type": "string", "description": "Value" } } } } } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/sizecharts/sizecharts",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["sizes_sizes_get", {
    name: "sizes_sizes_get",
    description: `Method that returns information about product sizes configured in the administration panel. List of size groups (with sizes that belong to particular group) is returned as a result.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "return_last_changed_time": { "type": "string", "description": "When the value is 'y', the last size modification date is returned, formatted as YYYY-MM-DD HH-MM-SS." } } },
    method: "get",
    pathTemplate: "/sizes/sizes",
    executionParameters: [{ "name": "return_last_changed_time", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["sizes_sizes_put", {
    name: "sizes_sizes_put",
    description: `Method that enables creating, deleting and editing product sizes in the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "sizes": { "type": "array", "description": "Size table.", "items": { "type": "object", "properties": { "faultCode": { "type": "number", "description": "Error code." }, "faultString": { "type": "string", "description": "Error description." }, "group_id": { "type": "number", "description": "Size group ID." }, "id": { "type": "string", "description": "Size identifier." }, "name": { "type": "string", "description": "Category plural name." }, "description": { "type": "string", "description": "Size description." }, "operation": { "type": "string", "description": "Operation type: add, edit, del" }, "lang_data": { "type": "array", "description": "", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Language code. Codes are compliant with ISO-639-3 standard." }, "name": { "type": "string", "description": "Category plural name." } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/sizes/sizes",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["snippets_campaign_get", {
    name: "snippets_campaign_get",
    description: `This call returns all snippet campaigns (including deleted ones but to readonly).
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "array", "description": "List of shop identifiers", "items": { "type": "number" } }, "id": { "type": "array", "description": "List of identifiers", "items": { "type": "number" } }, "omitDeleted": { "type": "string", "enum": ["y", "n"], "default": "y", "description": "Whether to skip the return of deleted campaigns." }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } } },
    method: "get",
    pathTemplate: "/snippets/campaign",
    executionParameters: [{ "name": "shopId", "in": "query" }, { "name": "id", "in": "query" }, { "name": "omitDeleted", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_campaign_put", {
    name: "snippets_campaign_put",
    description: `Use this operation to update snippet campaigns.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "campaigns": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["id"], "allOf": [{ "description": "A grouping element for snippets.", "properties": { "id": { "description": "Snippet campaign id", "type": "integer", "example": 1, "nullable": true }, "name": { "description": "Snippet campaign name", "type": "string" }, "description": { "description": "Snippet campaign internal description", "type": "string" }, "shop": { "description": "Shop ids where code snippets are active", "type": "array", "items": { "type": "integer" }, "example": [1], "nullable": true }, "active": { "description": "Whether the snippet is active", "type": "string", "enum": ["y", "n"] }, "deleted": { "description": "Whether the snippet campaign is deleted", "type": "string", "enum": ["y", "n"], "readOnly": true }, "order": { "description": "Snippet order.", "type": "integer" }, "snippetCount": { "description": "Number of code snippets associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true }, "activeSnippetCount": { "description": "Number of active code snippets associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true }, "configVariables": { "type": "array", "items": { "properties": { "key": { "description": "Key of config value.", "type": "string", "maxLength": 255, "minLength": 1 }, "name": { "description": "Name of config item.", "type": "string", "maxLength": 255, "minLength": 1, "readOnly": true }, "value": { "description": "Value of config item.", "type": "string", "maxLength": 255, "minLength": 0 } }, "type": "object", "title": "ConfigVariableValue", "x-readme-ref-name": "ConfigVariableValue" } } }, "type": "object", "title": "SnippetCampaign", "x-readme-ref-name": "SnippetCampaign" }] } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/snippets/campaign",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_campaign_post", {
    name: "snippets_campaign_post",
    description: `Use this operation to create snippet campaigns.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "campaigns": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["name"], "allOf": [{ "description": "A grouping element for snippets.", "properties": { "id": { "description": "Snippet campaign id", "type": "integer", "example": 1, "nullable": true }, "name": { "description": "Snippet campaign name", "type": "string" }, "description": { "description": "Snippet campaign internal description", "type": "string" }, "shop": { "description": "Shop ids where code snippets are active", "type": "array", "items": { "type": "integer" }, "example": [1], "nullable": true }, "active": { "description": "Whether the snippet is active", "type": "string", "enum": ["y", "n"] }, "deleted": { "description": "Whether the snippet campaign is deleted", "type": "string", "enum": ["y", "n"], "readOnly": true }, "order": { "description": "Snippet order.", "type": "integer" }, "snippetCount": { "description": "Number of code snippets associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true }, "activeSnippetCount": { "description": "Number of active code snippets associated with the campaign.", "type": "integer", "readOnly": true, "nullable": true }, "configVariables": { "type": "array", "items": { "properties": { "key": { "description": "Key of config value.", "type": "string", "maxLength": 255, "minLength": 1 }, "name": { "description": "Name of config item.", "type": "string", "maxLength": 255, "minLength": 1, "readOnly": true }, "value": { "description": "Value of config item.", "type": "string", "maxLength": 255, "minLength": 0 } }, "type": "object", "title": "ConfigVariableValue", "x-readme-ref-name": "ConfigVariableValue" } } }, "type": "object", "title": "SnippetCampaign", "x-readme-ref-name": "SnippetCampaign" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/snippets/campaign",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_campaign_delete", {
    name: "snippets_campaign_delete",
    description: `This call is used to remove campaign snippets.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "array", "description": "List of identifiers", "minLength": 1, "maxLength": 100, "items": { "type": "number" } } } },
    method: "delete",
    pathTemplate: "/snippets/campaign",
    executionParameters: [{ "name": "id", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_cookies_get", {
    name: "snippets_cookies_get",
    description: `This call returns all cookie definitions related to code snippets.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "array", "description": "List of identifiers for specific cookies", "items": { "type": "number" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } } },
    method: "get",
    pathTemplate: "/snippets/cookies",
    executionParameters: [{ "name": "id", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_cookies_put", {
    name: "snippets_cookies_put",
    description: `Use this operation to update a cookie definition for a code snippet.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "cookies": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["id"], "allOf": [{ "description": "Information about the cookie associated with the code snippet.", "properties": { "id": { "description": "Snippet", "type": "integer", "nullable": true }, "snippetId": { "description": "Id of the snippet code.", "type": "integer" }, "deliverer": { "description": "Name of the cookie vendor.", "type": "string", "maxLength": 128, "minLength": 1 }, "category": { "description": "Category of the cookie", "type": "string", "enum": ["analytics", "marketing", "functional"], "example": "cookie" }, "description": { "description": "Cookie description for each language.", "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" } }, "name": { "description": "Name of the cookie.", "type": "string", "maxLength": 128, "minLength": 1, "nullable": true }, "type": { "description": "Type of the cookie", "type": "string", "enum": ["cookie", "pixel", "localStorage"], "example": "cookie", "nullable": true }, "lifeTimeType": { "description": "Cookie lifetime mode", "type": "string", "enum": ["temporary", "days", "minutes"], "example": null, "nullable": true }, "lifeTime": { "description": "Cookie lifetime", "type": "integer", "example": null, "nullable": true } }, "type": "object", "title": "SnippetCookie", "x-readme-ref-name": "SnippetCookie" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/snippets/cookies",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_cookies_post", {
    name: "snippets_cookies_post",
    description: `Use this operation to create a cookie definition for a code snippet.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "cookies": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["snippetId", "deliverer"], "allOf": [{ "description": "Information about the cookie associated with the code snippet.", "properties": { "id": { "description": "Snippet", "type": "integer", "nullable": true }, "snippetId": { "description": "Id of the snippet code.", "type": "integer" }, "deliverer": { "description": "Name of the cookie vendor.", "type": "string", "maxLength": 128, "minLength": 1 }, "category": { "description": "Category of the cookie", "type": "string", "enum": ["analytics", "marketing", "functional"], "example": "cookie" }, "description": { "description": "Cookie description for each language.", "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" } }, "name": { "description": "Name of the cookie.", "type": "string", "maxLength": 128, "minLength": 1, "nullable": true }, "type": { "description": "Type of the cookie", "type": "string", "enum": ["cookie", "pixel", "localStorage"], "example": "cookie", "nullable": true }, "lifeTimeType": { "description": "Cookie lifetime mode", "type": "string", "enum": ["temporary", "days", "minutes"], "example": null, "nullable": true }, "lifeTime": { "description": "Cookie lifetime", "type": "integer", "example": null, "nullable": true } }, "type": "object", "title": "SnippetCookie", "x-readme-ref-name": "SnippetCookie" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/snippets/cookies",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_cookies_delete", {
    name: "snippets_cookies_delete",
    description: `This call is used to remove campaign cookies.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "array", "description": "List of cookie identifiers", "minLength": 1, "maxLength": 100, "items": { "type": "number" } } } },
    method: "delete",
    pathTemplate: "/snippets/cookies",
    executionParameters: [{ "name": "id", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_snippets_get", {
    name: "snippets_snippets_get",
    description: `This call returns all snippets.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "campaign": { "type": "array", "description": "List of campaign identifiers", "items": { "type": "number" } }, "id": { "type": "array", "description": "List of identifiers", "items": { "type": "number" } }, "omitDeleted": { "type": "string", "enum": ["y", "n"], "default": "y", "description": "Whether to skip the return of deleted campaigns." }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0", "minimum": 0, "default": 0 }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100", "minimum": 1, "maximum": 100, "default": 100 } } },
    method: "get",
    pathTemplate: "/snippets/snippets",
    executionParameters: [{ "name": "campaign", "in": "query" }, { "name": "id", "in": "query" }, { "name": "omitDeleted", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_snippets_put", {
    name: "snippets_snippets_put",
    description: `Use this operation to update code snippet.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "snippets": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["id"], "allOf": [{ "properties": { "id": { "description": "Id of the code snippet.", "type": "integer", "nullable": true }, "name": { "description": "The snippet name.", "type": "string", "example": "test html" }, "active": { "description": "Whether the snippet is active.", "type": "string", "enum": ["y", "n"], "example": "n" }, "campaign": { "description": "Snippet campaign id", "type": "integer", "example": 1 }, "dateBegin": { "type": "object", "allOf": [{ "description": "Filter to control snippet activation.", "properties": { "defined": { "description": "Whether date condition is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "date": { "description": "Date of snippet activation", "type": "string", "format": "date", "example": null, "nullable": true } }, "type": "object", "title": "SnippetDate", "x-readme-ref-name": "SnippetDate" }, { "properties": { "autoBlock": { "description": "Automatic shutdown control", "type": "string", "enum": ["y", "n"], "example": "n" } } }], "title": "SnippetDateAutoBlock", "x-readme-ref-name": "SnippetDateAutoBlock" }, "dateEnd": { "description": "Filter to control snippet activation.", "properties": { "defined": { "description": "Whether date condition is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "date": { "description": "Date of snippet activation", "type": "string", "format": "date", "example": null, "nullable": true } }, "type": "object", "title": "SnippetDate", "x-readme-ref-name": "SnippetDate" }, "type": { "description": "Code snippet type.", "type": "string", "enum": ["html", "javascript", "cgi"], "example": "html" }, "useAjax": { "description": "Whether to load contents asynchronously via XHR request.", "type": "string", "enum": ["y", "n"], "example": "y" }, "link": { "description": "Url.", "type": "string", "example": "https://" }, "timeout": { "description": "Content waiting time (timeout) in seconds.", "type": "integer", "maximum": 10, "minimum": 1, "example": 1 }, "zone": { "description": "The place where the code snippet is loaded.", "type": "string", "enum": ["head", "bodyBegin", "bodyEnd"], "example": "head" }, "order": { "description": "The order in which the code snippet will be displayed.", "type": "integer", "example": 0 }, "body": { "description": "Snippet content for each language.", "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" } }, "display": { "type": "object", "allOf": [{ "properties": { "clientType": { "description": "Type of customers to whom to display the snippet", "type": "string", "enum": ["all", "unregistered", "registered", "retailer", "wholesaler"] }, "newsletter": { "description": "Whether to display only for newsletter visitors.", "type": "string", "enum": ["y", "n", "all"] }, "hasOrders": { "description": "Whether to display the code snippet only for customers who have placed an order", "type": "string", "enum": ["y", "n", "all"] }, "useRebateCode": { "description": "Display only after entering rebate code", "type": "string", "enum": ["y", "n", "all"] } }, "type": "object", "title": "DisplaySettings", "x-readme-ref-name": "DisplaySettings" }, { "properties": { "screen": { "description": "Display on desktop screens", "type": "string", "enum": ["y", "n"] }, "tablet": { "description": "Display on mobile tablets", "type": "string", "enum": ["y", "n"] }, "phone": { "description": "Display on mobile phones", "type": "string", "enum": ["y", "n"] } } }], "title": "SnippetDisplaySettings", "x-readme-ref-name": "SnippetDisplaySettings" }, "pages": { "properties": { "all": { "description": "Whether to display to all sites.", "type": "string", "enum": ["y", "n"] }, "pages": { "description": "List of selected pages where snippet shows (works for all=n mode).\nIf passed, the url should be omitted.", "type": "array", "items": { "enum": ["home", "basket", "checkout_payment_delivery", "checkout_confirmation", "new_order_placement", "order_details", "navigation", "product_details", "search_results", "after_order_place", "mailing_subscribe", "payment_success", "payment_error", "payment_pending", "other_pages"] } }, "url": { "description": "List of selected url (works for all=n mode)\nIf passed, pages should be omitted.", "type": "array", "items": { "type": "string" } } }, "type": "object", "title": "SnippetPagesSettings", "x-readme-ref-name": "SnippetPagesSettings" }, "sources": { "description": "Snippet entry source filter.", "properties": { "direct": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "search": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "advert": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "priceComparers": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "affiliate": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "cpa": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "newsletter": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "social": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "page": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true } }, "type": "object", "title": "SnippetSourcesSettings", "x-readme-ref-name": "SnippetSourcesSettings" }, "deleted": { "description": "Whether the snippet is marked as deleted.", "type": "string", "enum": ["y", "n"], "readOnly": true }, "cookiesCount": { "description": "The number of cookies associated with the snippet.", "type": "integer", "readOnly": true } }, "type": "object", "externalDocs": { "description": "Idosell.com", "url": "https://www.idosell.com/en/developers/html-and-javascript-snippets/" }, "title": "Snippet", "x-readme-ref-name": "Snippet" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/snippets/snippets",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_snippets_post", {
    name: "snippets_snippets_post",
    description: `Use this operation to create code snippet.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "params": { "type": "object", "properties": { "snippets": { "type": "array", "minItems": 1, "maxItems": 100, "items": { "required": ["campaign", "name"], "allOf": [{ "properties": { "id": { "description": "Id of the code snippet.", "type": "integer", "nullable": true }, "name": { "description": "The snippet name.", "type": "string", "example": "test html" }, "active": { "description": "Whether the snippet is active.", "type": "string", "enum": ["y", "n"], "example": "n" }, "campaign": { "description": "Snippet campaign id", "type": "integer", "example": 1 }, "dateBegin": { "type": "object", "allOf": [{ "description": "Filter to control snippet activation.", "properties": { "defined": { "description": "Whether date condition is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "date": { "description": "Date of snippet activation", "type": "string", "format": "date", "example": null, "nullable": true } }, "type": "object", "title": "SnippetDate", "x-readme-ref-name": "SnippetDate" }, { "properties": { "autoBlock": { "description": "Automatic shutdown control", "type": "string", "enum": ["y", "n"], "example": "n" } } }], "title": "SnippetDateAutoBlock", "x-readme-ref-name": "SnippetDateAutoBlock" }, "dateEnd": { "description": "Filter to control snippet activation.", "properties": { "defined": { "description": "Whether date condition is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "date": { "description": "Date of snippet activation", "type": "string", "format": "date", "example": null, "nullable": true } }, "type": "object", "title": "SnippetDate", "x-readme-ref-name": "SnippetDate" }, "type": { "description": "Code snippet type.", "type": "string", "enum": ["html", "javascript", "cgi"], "example": "html" }, "useAjax": { "description": "Whether to load contents asynchronously via XHR request.", "type": "string", "enum": ["y", "n"], "example": "y" }, "link": { "description": "Url.", "type": "string", "example": "https://" }, "timeout": { "description": "Content waiting time (timeout) in seconds.", "type": "integer", "maximum": 10, "minimum": 1, "example": 1 }, "zone": { "description": "The place where the code snippet is loaded.", "type": "string", "enum": ["head", "bodyBegin", "bodyEnd"], "example": "head" }, "order": { "description": "The order in which the code snippet will be displayed.", "type": "integer", "example": 0 }, "body": { "description": "Snippet content for each language.", "type": "array", "items": { "properties": { "lang": { "description": "Language code.", "type": "string", "maxLength": 3, "minLength": 3, "example": "pol" }, "body": { "type": "string", "example": "Hello world" } }, "type": "object", "title": "LanguageContent", "x-readme-ref-name": "LanguageContent" } }, "display": { "type": "object", "allOf": [{ "properties": { "clientType": { "description": "Type of customers to whom to display the snippet", "type": "string", "enum": ["all", "unregistered", "registered", "retailer", "wholesaler"] }, "newsletter": { "description": "Whether to display only for newsletter visitors.", "type": "string", "enum": ["y", "n", "all"] }, "hasOrders": { "description": "Whether to display the code snippet only for customers who have placed an order", "type": "string", "enum": ["y", "n", "all"] }, "useRebateCode": { "description": "Display only after entering rebate code", "type": "string", "enum": ["y", "n", "all"] } }, "type": "object", "title": "DisplaySettings", "x-readme-ref-name": "DisplaySettings" }, { "properties": { "screen": { "description": "Display on desktop screens", "type": "string", "enum": ["y", "n"] }, "tablet": { "description": "Display on mobile tablets", "type": "string", "enum": ["y", "n"] }, "phone": { "description": "Display on mobile phones", "type": "string", "enum": ["y", "n"] } } }], "title": "SnippetDisplaySettings", "x-readme-ref-name": "SnippetDisplaySettings" }, "pages": { "properties": { "all": { "description": "Whether to display to all sites.", "type": "string", "enum": ["y", "n"] }, "pages": { "description": "List of selected pages where snippet shows (works for all=n mode).\nIf passed, the url should be omitted.", "type": "array", "items": { "enum": ["home", "basket", "checkout_payment_delivery", "checkout_confirmation", "new_order_placement", "order_details", "navigation", "product_details", "search_results", "after_order_place", "mailing_subscribe", "payment_success", "payment_error", "payment_pending", "other_pages"] } }, "url": { "description": "List of selected url (works for all=n mode)\nIf passed, pages should be omitted.", "type": "array", "items": { "type": "string" } } }, "type": "object", "title": "SnippetPagesSettings", "x-readme-ref-name": "SnippetPagesSettings" }, "sources": { "description": "Snippet entry source filter.", "properties": { "direct": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "search": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "advert": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "priceComparers": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "affiliate": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "cpa": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "newsletter": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "social": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true }, "page": { "oneOf": [{ "properties": { "active": { "description": "Whether source filter is active", "type": "string", "enum": ["y", "n"], "example": "n" }, "id": { "description": "Id of service of given source", "type": "integer", "nullable": true } }, "type": "object", "title": "SourceFilter", "x-readme-ref-name": "SourceFilter" }], "nullable": true } }, "type": "object", "title": "SnippetSourcesSettings", "x-readme-ref-name": "SnippetSourcesSettings" }, "deleted": { "description": "Whether the snippet is marked as deleted.", "type": "string", "enum": ["y", "n"], "readOnly": true }, "cookiesCount": { "description": "The number of cookies associated with the snippet.", "type": "integer", "readOnly": true } }, "type": "object", "externalDocs": { "description": "Idosell.com", "url": "https://www.idosell.com/en/developers/html-and-javascript-snippets/" }, "title": "Snippet", "x-readme-ref-name": "Snippet" }, { "properties": { "id": { "type": "integer", "nullable": true, "example": null } } }] } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/snippets/snippets",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["snippets_snippets_delete", {
    name: "snippets_snippets_delete",
    description: `This call is used to remove snippets.
(Tags: CMS)`,
    inputSchema: { "type": "object", "properties": { "id": { "type": "array", "description": "List of identifiers", "minLength": 1, "maxLength": 100, "items": { "type": "number" } } } },
    method: "delete",
    pathTemplate: "/snippets/snippets",
    executionParameters: [{ "name": "id", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CMS"],
    deprecated: false
  }],
  ["subscriptions_addProduct_post", {
    name: "subscriptions_addProduct_post",
    description: `The method allowing adding products to subscription
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "addProducts": { "required": ["subscriptionId", "products"], "properties": { "subscriptionId": { "description": "Id of subscription", "type": "number", "minimum": 1 }, "products": { "description": "Collection of products to edit", "type": "array", "items": { "required": ["productId"], "properties": { "productId": { "description": "ID of record in database", "type": "number", "minimum": 1 }, "sizeId": { "description": "ID of size", "type": "string" }, "quantity": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$" } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "bundledProducts": { "description": "Bundled items", "type": "array", "items": { "type": "object" } }, "comment": { "description": "Comment for product", "type": "string" }, "label": { "description": "Label for product", "type": "string" }, "splitBundleInOrderDocuments": { "description": "Variable that determinates if bundle should be splitted to seperate positions on order documents", "type": "boolean" }, "price": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$" } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "priceNet": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$" } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" } }, "type": "object", "title": "SubscriptionAddProduct", "x-readme-ref-name": "SubscriptionAddProduct" } } }, "type": "object", "title": "SubscriptionAddProducts", "x-readme-ref-name": "SubscriptionAddProducts" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/addProduct",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_changeDeliveryDates_post", {
    name: "subscriptions_changeDeliveryDates_post",
    description: `The method allowing to change subscriptions delivery dates
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "subscriptionsDeliveryDatesModel": { "required": ["subscriptionIds", "upcomingDeliveryDate"], "properties": { "subscriptionIds": { "description": "Subscription ids", "type": "array", "items": { "type": "number" } }, "upcomingDeliveryDate": { "description": "Settings that determinates if price should be updated automaticly", "type": "string" }, "changeNextDeliveryDate": { "description": "A setting that determines whether to also change the date of the next delivery.", "type": "boolean" } }, "type": "object", "title": "SubscriptionsDeliveryDatesModel", "x-readme-ref-name": "SubscriptionsDeliveryDatesModel" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/changeDeliveryDates",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_changePriceAutoUpdate_post", {
    name: "subscriptions_changePriceAutoUpdate_post",
    description: `The method allowing to change subscriptions price auto update setting
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "subscriptionsAutoPriceModel": { "required": ["subscriptionIds"], "properties": { "subscriptionIds": { "description": "Subscription ids", "type": "array", "items": { "type": "number" } }, "autoPriceUpdate": { "description": "Settings that determinates if price should be updated automaticly", "type": "boolean" } }, "type": "object", "title": "SubscriptionsAutoPriceModel", "x-readme-ref-name": "SubscriptionsAutoPriceModel" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/changePriceAutoUpdate",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_changeStatus_post", {
    name: "subscriptions_changeStatus_post",
    description: `The method allowing to change subscriptions status
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "subscriptionsStatusModel": { "required": ["subscriptionIds"], "properties": { "subscriptionIds": { "description": "Subscription ids", "type": "array", "items": { "type": "number" } }, "subscriptionStatus": { "description": "Status to set", "type": "string", "enum": ["active", "hold", "nonpayment", "finished"] }, "sendMailAfterStatusChange": { "description": "Option allowing sending e-mail after status change", "type": "boolean" }, "sendSMSAfterStatusChange": { "description": "Optian allowing sending SMS after status change", "type": "boolean" } }, "type": "object", "title": "SubscriptionsStatusModel", "x-readme-ref-name": "SubscriptionsStatusModel" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/changeStatus",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_deleteProduct_post", {
    name: "subscriptions_deleteProduct_post",
    description: `The method allowing for products in subscription removeing.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "subscriptionDeleteProducts": { "required": ["subscriptionId", "idsToDelete"], "properties": { "subscriptionId": { "description": "Id of subscription", "type": "number", "minimum": 1 }, "idsToDelete": { "description": "Ids in products table to delete", "type": "array", "items": { "type": "number" } } }, "type": "object", "title": "SubscriptionDeleteProducts", "x-readme-ref-name": "SubscriptionDeleteProducts" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/deleteProduct",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_edit_post", {
    name: "subscriptions_edit_post",
    description: `The method allowing for subscription editing.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "subscriptionsEditRequest": { "description": "Subscriptions model", "properties": { "subscriptionModels": { "description": "Subscription", "type": "array", "items": { "required": ["id"], "properties": { "externalId": { "description": "Subscription ID for external service", "type": ["string", "null"] }, "status": { "description": "Subscription status", "type": "string", "enum": ["active", "hold", "nonpayment", "finished"] }, "subscriptionNote": { "description": "Note to subscription (internal)", "type": ["string", "null"] }, "upcomingDeliveryDate": { "description": "Estimated date of the upcoming delivery\n\nUpcoming delivery date can be null in the case of \"hold\" and \"finished\" statuses – upon reactivation, this date will be calculated according to the days in period.\nIn the case of the \"active\" status, this parameter is mandatory.", "type": ["string", "null"] }, "priceAutoUpdate": { "description": "Update price automaticly", "type": "boolean" }, "nextDeliveryDate": { "description": "Estimated date of the next delivery\n\nNext delivery date can be null in the case of \"hold\" and \"finished\" statuses – upon reactivation, this date will be calculated according to the days in period.\nIn the case of the \"active\" status, this parameter is mandatory.", "type": ["string", "null"] }, "creationNextOrderDate": { "description": "date on which the next order will be created", "type": ["string", "null"] }, "daysInPeriod": { "description": "Setting that change subscription period (in days)", "type": "number", "minimum": 1 }, "confirmationExpirationDate": { "description": "Date by which the customer should accept the subscription terms (an empty value means that the subscription terms do not require acceptance)", "type": ["string", "null"] }, "acceptationDeadlineDate": { "description": "Date of create order", "type": ["string", "null"] }, "id": { "description": "Subscription ID", "type": "number", "minimum": 1 }, "sendMailAfterStatusChange": { "description": "Option allowing sending e-mail after status change", "type": "boolean" }, "sendSMSAfterStatusChange": { "description": "Optian allowing sending SMS after status change", "type": "boolean" }, "orderData": { "properties": { "deliveryCost": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$" } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "orderDelivery": { "properties": { "courierNote": { "description": "Note for courier", "type": "string" }, "pickupPointId": { "description": "Pickup point's identifier", "type": "string" }, "deliveryFormId": { "description": "Delivery's form identifier", "type": "number", "minimum": 1 }, "deliveryAddressId": { "description": "Client's delivery address ID", "type": "number", "minimum": 1 } }, "type": "object", "title": "SubscriptionEditOrderDeliveryData", "x-readme-ref-name": "SubscriptionEditOrderDeliveryData" }, "payerAddressId": { "description": "Payer's address identifier", "type": ["number", "null"] }, "noteToStaff": { "description": "Note to stuff", "type": "string" } }, "type": "object", "title": "SubscriptionEditOrderModel", "x-readme-ref-name": "SubscriptionEditOrderModel" }, "rebatesThresholds": { "description": "Thresholds rebates for  newly created subscription orders", "type": ["array", "null"], "items": { "properties": { "numberFrom": { "description": "Number from", "type": "integer", "minimum": 1, "example": 1 }, "numberTo": { "description": "Number to", "type": "integer", "minimum": 1, "example": 2 }, "type": { "description": "Type", "type": "string", "enum": ["percentage", "quota"], "example": "percentage" }, "value": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$", "example": "0.01", "nullable": false } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" } }, "type": "object", "title": "SubscriptionRebatesThreshold", "x-readme-ref-name": "SubscriptionRebatesThreshold" } }, "paymentData": { "properties": { "externalPaymentId": { "description": "ID of external payment", "type": ["string", "null"] }, "externalPaymentHandle": { "description": "Handle for external payment", "type": ["string", "null"] } }, "type": "object", "title": "ExternalPaymentModel", "x-readme-ref-name": "ExternalPaymentModel" } }, "type": "object", "title": "SubscriptionEditModel", "x-readme-ref-name": "SubscriptionEditModel" } } }, "type": "object", "title": "SubscriptionsEditRequest", "x-readme-ref-name": "SubscriptionsEditRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/edit",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_editProduct_post", {
    name: "subscriptions_editProduct_post",
    description: `The method allowing for products in subscription editing.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "subscriptionEditProducts": { "required": ["subscriptionId", "products"], "properties": { "subscriptionId": { "description": "Id of subscription", "type": "number", "minimum": 1 }, "products": { "description": "Collection of products to edit", "type": "array", "items": { "properties": { "id": { "description": "ID of record in database", "type": "number", "minimum": 1 }, "variantId": { "description": "The variant ID you want to change to", "type": "number", "minimum": 1 }, "variantSizeId": { "description": "ID of variant's size", "type": "string" }, "quantity": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$" } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "price": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$" } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "netPrice": { "description": "A representation of a floating-point number with precise accuracy.", "required": ["value"], "properties": { "value": { "description": "A decimal.", "type": "string", "format": "number", "pattern": "^(\\-|\\+)?((\\d+(\\.\\d*)?)|(\\.\\d+))$" } }, "type": "object", "title": "Decimal", "x-readme-ref-name": "Decimal" }, "label": { "description": "Label to the product", "type": ["string", "null"] } }, "type": "object", "title": "SubscriptionEditProduct", "x-readme-ref-name": "SubscriptionEditProduct" } } }, "type": "object", "title": "SubscriptionEditProducts", "x-readme-ref-name": "SubscriptionEditProducts" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/editProduct",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_items_list_post", {
    name: "subscriptions_items_list_post",
    description: `List of items assigned to subscription.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "properties": { "filter": { "properties": { "id": { "description": "Identyfier of action where products are", "type": "number", "minimum": 1 } }, "type": "object", "title": "ItemsViewFilter", "x-readme-ref-name": "ItemsViewFilter" }, "orderBy": { "properties": { "property": { "description": "Order by property", "type": "string", "enum": ["id", "price", "netPrice"] }, "direction": { "description": "Order by direction", "type": "string", "enum": ["asc", "desc"] } }, "type": "object", "title": "ItemsViewOrderBy", "x-readme-ref-name": "ItemsViewOrderBy" }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" } }, "type": "object", "title": "ItemsViewRequest", "x-readme-ref-name": "ItemsViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/items/list",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_listView_fetchIds_post", {
    name: "subscriptions_listView_fetchIds_post",
    description: `List of subscriptions ID's of the store.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "filter": { "description": "Filters that limit the result of a customer query.", "properties": { "ids": { "description": "Subscription IDs", "type": ["array", "null"], "items": { "type": "integer" } }, "statuses": { "description": "Subscription statuses", "type": "array", "items": { "type": "string", "enum": ["active", "hold", "nonpayment", "finished"] } }, "clientId": { "description": "Client ID", "type": ["number", "null"] }, "shopId": { "description": "Shop ID", "type": ["number", "null"] }, "priceChangeMode": { "description": "Price change mode", "type": ["string", "null"], "enum": ["auto", "manual"] }, "createDateTime": { "oneOf": [{ "description": "A universal structure for time intervals.", "properties": { "from": { "description": "Time \"from\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-01T00:00:00.000Z", "nullable": true }, "to": { "description": "Time \"to\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-07T00:00:00.000Z", "nullable": true } }, "type": "object", "title": "DateTimeRange", "x-readme-ref-name": "DateTimeRange" }], "type": "null" }, "finishDateTime": { "oneOf": [{ "description": "A universal structure for time intervals.", "properties": { "from": { "description": "Time \"from\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-01T00:00:00.000Z", "nullable": true }, "to": { "description": "Time \"to\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-07T00:00:00.000Z", "nullable": true } }, "type": "object", "title": "DateTimeRange", "x-readme-ref-name": "DateTimeRange" }], "type": "null" }, "upcomingDeliveryDate": { "oneOf": [{ "description": "Universal structure for intervals.", "properties": { "from": { "description": "Date “from” (RFC)", "type": "string", "format": "date", "example": "2023-01-01", "nullable": true }, "to": { "description": "Data \"do\" (RFC)", "type": "string", "format": "date", "example": "2023-01-07", "nullable": true } }, "type": "object", "title": "DateRange", "x-readme-ref-name": "DateRange" }], "type": "null" }, "nextDeliveryDate": { "oneOf": [{ "description": "Universal structure for intervals.", "properties": { "from": { "description": "Date “from” (RFC)", "type": "string", "format": "date", "example": "2023-01-01", "nullable": true }, "to": { "description": "Data \"do\" (RFC)", "type": "string", "format": "date", "example": "2023-01-07", "nullable": true } }, "type": "object", "title": "DateRange", "x-readme-ref-name": "DateRange" }], "type": "null" }, "textSearch": { "description": "Text search phrase", "type": ["string", "null"] } }, "type": "object", "title": "SubscriptionViewFilter", "x-readme-ref-name": "SubscriptionViewFilter" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/listView/fetchIds",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_listView_list_post", {
    name: "subscriptions_listView_list_post",
    description: `List of subscriptions of the store. Allows you to download data for editing and basic statistics.
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Object describing the request for a list of Subscriptions.", "properties": { "select": { "properties": { "productsData": { "type": "boolean", "default": false }, "rebatesThresholds": { "type": "boolean", "default": false }, "rebateCode": { "type": "boolean", "default": false }, "paymentData": { "type": "boolean", "default": false }, "clientBillingData": { "type": "boolean", "default": false }, "orderDeliveryAddress": { "type": "boolean", "default": false }, "courierData": { "type": "boolean", "default": false }, "payerAddress": { "type": "boolean", "default": false } }, "type": "object", "title": "SubscriptionViewSelect", "x-readme-ref-name": "SubscriptionViewSelect" }, "filter": { "description": "Filters that limit the result of a customer query.", "properties": { "ids": { "description": "Subscription IDs", "type": ["array", "null"], "items": { "type": "integer" } }, "statuses": { "description": "Subscription statuses", "type": "array", "items": { "type": "string", "enum": ["active", "hold", "nonpayment", "finished"] } }, "clientId": { "description": "Client ID", "type": ["number", "null"] }, "shopId": { "description": "Shop ID", "type": ["number", "null"] }, "priceChangeMode": { "description": "Price change mode", "type": ["string", "null"], "enum": ["auto", "manual"] }, "createDateTime": { "oneOf": [{ "description": "A universal structure for time intervals.", "properties": { "from": { "description": "Time \"from\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-01T00:00:00.000Z", "nullable": true }, "to": { "description": "Time \"to\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-07T00:00:00.000Z", "nullable": true } }, "type": "object", "title": "DateTimeRange", "x-readme-ref-name": "DateTimeRange" }], "type": "null" }, "finishDateTime": { "oneOf": [{ "description": "A universal structure for time intervals.", "properties": { "from": { "description": "Time \"from\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-01T00:00:00.000Z", "nullable": true }, "to": { "description": "Time \"to\" (RFC, UTC)", "type": "string", "format": "date-time", "example": "2023-01-07T00:00:00.000Z", "nullable": true } }, "type": "object", "title": "DateTimeRange", "x-readme-ref-name": "DateTimeRange" }], "type": "null" }, "upcomingDeliveryDate": { "oneOf": [{ "description": "Universal structure for intervals.", "properties": { "from": { "description": "Date “from” (RFC)", "type": "string", "format": "date", "example": "2023-01-01", "nullable": true }, "to": { "description": "Data \"do\" (RFC)", "type": "string", "format": "date", "example": "2023-01-07", "nullable": true } }, "type": "object", "title": "DateRange", "x-readme-ref-name": "DateRange" }], "type": "null" }, "nextDeliveryDate": { "oneOf": [{ "description": "Universal structure for intervals.", "properties": { "from": { "description": "Date “from” (RFC)", "type": "string", "format": "date", "example": "2023-01-01", "nullable": true }, "to": { "description": "Data \"do\" (RFC)", "type": "string", "format": "date", "example": "2023-01-07", "nullable": true } }, "type": "object", "title": "DateRange", "x-readme-ref-name": "DateRange" }], "type": "null" }, "textSearch": { "description": "Text search phrase", "type": ["string", "null"] } }, "type": "object", "title": "SubscriptionViewFilter", "x-readme-ref-name": "SubscriptionViewFilter" }, "orderBy": { "description": "Order by settings.", "properties": { "property": { "description": "A property or combination for sorting the results.", "type": "string", "default": "id", "enum": ["id", "status", "numberOfOrders", "createDateTime", "upcomingDeliveryDate", "nextDeliveryDate", "clientBillingData"] }, "orderByDirection": { "description": "Order direction.", "type": "string", "default": "asc", "enum": ["asc", "desc"] } }, "type": "object", "title": "SubscriptionViewOrderBy", "x-readme-ref-name": "SubscriptionViewOrderBy" }, "pagination": { "description": "Pagination settings.", "properties": { "page": { "description": "Page index (starting from 0)", "type": "number", "default": 0, "minimum": 0 }, "perPage": { "description": "Number of records per page.", "type": "number", "default": 100, "maximum": 1000, "minimum": 1 } }, "type": "object", "title": "PaginationFilter", "x-readme-ref-name": "PaginationFilter" } }, "type": "object", "title": "SubscriptionsViewRequest", "x-readme-ref-name": "SubscriptionsViewRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/listView/list",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_setRebateCode_post", {
    name: "subscriptions_setRebateCode_post",
    description: `The method for set rebate code
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Object with discount code data to set", "properties": { "id": { "description": "Subscription ID", "type": "number" }, "code": { "description": "Code value", "type": "string" } }, "type": "object", "title": "SubscriptionSetRebateCodeRequest", "x-readme-ref-name": "SubscriptionSetRebateCodeRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/setRebateCode",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["subscriptions_unsetRebateCode_post", {
    name: "subscriptions_unsetRebateCode_post",
    description: `The method for set rebate code
(Tags: OMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "properties": { "request": { "description": "Object with request witch unset rebate code", "properties": { "id": { "description": "Subscription ID", "type": "number" } }, "type": "object", "title": "SubscriptionUnsetRebateCodeRequest", "x-readme-ref-name": "SubscriptionUnsetRebateCodeRequest" } }, "type": "object", "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/subscriptions/unsetRebateCode",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["OMS"],
    deprecated: false
  }],
  ["system_config_get", {
    name: "system_config_get",
    description: `Method is used for extracting information about a shop and its most important configuration settings.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/system/config",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_config_put", {
    name: "system_config_put",
    description: `The method is used to manage the most important settings in the store and in the panel. It enables, among others, configuration of tax and billing settings and configuration of warehouse management.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "panelSettings": { "type": "object", "description": "Panel settings", "properties": { "mainStockSystem": { "type": "string", "description": "The main warehouse and sales system", "enum": ["other", "iai"] }, "stockStateConfig": { "type": "string", "description": "Stock quantities in third party application", "enum": ["uncontrolled", "bridge", "outside"] }, "taxSettings": { "type": "object", "description": "Fiscal and settlement settings", "properties": { "saleDatePrepaid": { "type": "string", "description": "Sales date settings on sales documents for prepaid orders", "enum": ["saleDateFromOrder", "saleDateFromPayment", "saleDateFromDocument"] }, "saleDateCashOnDelivery": { "type": "string", "description": "Sales date settings on sales documents for orders paid with cash on delivery", "enum": ["saleDateFromOrder", "saleDateFromPayment", "saleDateFromDocument"] }, "saleDateTradeCredit": { "type": "string", "description": "Sales date settings on sales documents for orders paid with trade credit", "enum": ["saleDateFromOrder", "saleDateFromPayment", "saleDateFromDocument"] }, "currencyRate": { "type": "string", "description": "Configuration of default currency rate for orders", "enum": ["currentDay", "previousDay"] } } }, "shops": { "type": "array", "description": "", "items": { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "salesDocumentsAreCreatedByClient": { "type": "string", "description": "Sales documents in third party application.", "enum": ["y", "n"] } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/system/config",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_currencies_get", {
    name: "system_currencies_get",
    description: `This method returns the current exchange rate in relation to the currency set in the administration panel.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "symbol": { "type": "string", "description": "Currency symbol in ISO 4217 format." }, "date": { "type": "string", "description": "Date in format YYYY-MM-DD-HH MM:SS." } } },
    method: "get",
    pathTemplate: "/system/currencies",
    executionParameters: [{ "name": "symbol", "in": "query" }, { "name": "date", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_currencies_put", {
    name: "system_currencies_put",
    description: `Method that allows for setting currency exchange rates in relation to the currency set in the administration panel.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "currencies": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "string", "description": "Currency code in ISO 4217 standard." }, "rate": { "type": "number", "description": "Currency exchange rate. Maximal value is 10000.", "format": "float" }, "scale": { "type": "number", "description": "Currency smaller unit." } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/system/currencies",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_processesAutomation_get", {
    name: "system_processesAutomation_get",
    description: `It allows you to download the current automation processes configuration .
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "shopId": { "type": "number", "description": "Shop Id" } } },
    method: "get",
    pathTemplate: "/system/processesAutomation",
    executionParameters: [{ "name": "shopId", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_processesAutomation_put", {
    name: "system_processesAutomation_put",
    description: `The method is used for edit of processes automation settings .
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "shopId": { "type": "number", "description": "Shop Id" }, "orders": { "type": "object", "description": "Orders.", "properties": { "alwaysAllowSentStatus": { "type": "string", "description": "Allow the status to be changed to \"Shipped\" even if the order payments and stock levels do not match", "enum": ["y", "n"] }, "restrictions": { "type": "object", "description": "Order management restrictions", "properties": { "blockIfIncorrectStockQuantities": { "type": "object", "description": "Block the ability of selecting a status, if there are products in the warehouse from which the order is being processed, with insufficient stock level.", "properties": { "finished": { "type": "string", "description": "", "enum": ["y", "n"] } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/system/processesAutomation",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_serverLoad_get", {
    name: "system_serverLoad_get",
    description: `This method returns server status information which is useful in determining whether the server is currently overloaded.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/system/serverLoad",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_serverTime_get", {
    name: "system_serverTime_get",
    description: `Method that returns the current server time, which is essential for authentication.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/system/serverTime",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_shopsData_get", {
    name: "system_shopsData_get",
    description: `Method is used for extracting information about a shop and its most important configuration settings.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": {} },
    method: "get",
    pathTemplate: "/system/shopsData",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_units_get", {
    name: "system_units_get",
    description: `The method allows units of measurement to be downloaded from the IdoSell administration panel.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "languagesIds": { "type": "array", "description": "List of languages", "items": { "type": "string" } } } },
    method: "get",
    pathTemplate: "/system/units",
    executionParameters: [{ "name": "languagesIds", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_units_put", {
    name: "system_units_put",
    description: `The method allows existing units of measurement to be updated to the IdoSell administration panel.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "", "properties": { "units": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "#!IdentyfikatorJednostki!#" }, "nameInPanel": { "type": "string", "description": "Name in panel (limit of 30 characters)" }, "precisionUnit": { "type": "number", "description": "Accuracy (number of places after comma)" }, "visible": { "type": "boolean", "description": "Visibility" }, "descriptions": { "type": "array", "description": "Unit names", "items": { "type": "object", "properties": { "language": { "type": "string", "description": "ISO-639-3 Language" }, "nameSingular": { "type": "string", "description": "Name (singular) (limit of 30 characters)" }, "namePlural": { "type": "string", "description": "Name (plural) (limit of 30 characters)" }, "nameFractions": { "type": "string", "description": "Name (by fractions) (limit of 30 characters)" } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/system/units",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["system_users_get", {
    name: "system_users_get",
    description: `Method that returns information about IdoSell Shop administration panel users.
(Tags: SYSTEM)`,
    inputSchema: { "type": "object", "properties": { "userType": { "type": "string", "enum": ["all", "active"], "description": "User type. List of options \"all\" - All users, \"active\" - Only active users" } } },
    method: "get",
    pathTemplate: "/system/users",
    executionParameters: [{ "name": "userType", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["SYSTEM"],
    deprecated: false
  }],
  ["vouchers_block_put", {
    name: "vouchers_block_put",
    description: `Enables gift voucer blocking
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "vouchers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Voucher ID" }, "number": { "type": "string", "description": "Number." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/vouchers/block",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["vouchers_types_get", {
    name: "vouchers_types_get",
    description: `Allows for downloading all discount code campaigns defined in the administration panel
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/vouchers/types",
    executionParameters: [{ "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["vouchers_unblock_put", {
    name: "vouchers_unblock_put",
    description: `Enables gift vouchers unblocking
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "vouchers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Voucher ID" }, "number": { "type": "string", "description": "Number." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/vouchers/unblock",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["vouchers_vouchers_delete_post", {
    name: "vouchers_vouchers_delete_post",
    description: `Enables deleting a single or a list of gift vouchers
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "vouchers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Voucher ID" }, "number": { "type": "string", "description": "Number." } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/vouchers/vouchers/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["vouchers_vouchers_get", {
    name: "vouchers_vouchers_get",
    description: `Enables searching for vouchers and retrieving information about indicated vouchers
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "vouchers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Voucher ID" }, "number": { "type": "string", "description": "Number." } } } }, "voucherTypeId": { "type": "number", "description": "Discount code campaign ID" }, "name": { "type": "string", "description": "Name." }, "status": { "type": "string", "description": "Status", "enum": ["all", "used", "unused", "unverified"] }, "generetedFromAffiliateProgram": { "type": "string", "description": "Generated in the affiliate program", "enum": ["all", "y", "n"] }, "noteContain": { "type": "string", "description": "Notes contain" }, "balanceFrom": { "type": "number", "description": "Value from", "format": "float" }, "balanceTo": { "type": "number", "description": "Value to", "format": "float" }, "expirationDateFrom": { "type": "string", "description": "Expiration date from" }, "expirationDateTo": { "type": "string", "description": "Expiration date to" }, "issueDateFrom": { "type": "string", "description": "Created from" }, "issueDateTo": { "type": "string", "description": "Created to" }, "usageDateFrom": { "type": "string", "description": "To be used from" }, "usageDateTo": { "type": "string", "description": "To be used to" }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/vouchers/vouchers",
    executionParameters: [{ "name": "vouchers", "in": "query" }, { "name": "voucherTypeId", "in": "query" }, { "name": "name", "in": "query" }, { "name": "status", "in": "query" }, { "name": "generetedFromAffiliateProgram", "in": "query" }, { "name": "noteContain", "in": "query" }, { "name": "balanceFrom", "in": "query" }, { "name": "balanceTo", "in": "query" }, { "name": "expirationDateFrom", "in": "query" }, { "name": "expirationDateTo", "in": "query" }, { "name": "issueDateFrom", "in": "query" }, { "name": "issueDateTo", "in": "query" }, { "name": "usageDateFrom", "in": "query" }, { "name": "usageDateTo", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["vouchers_vouchers_put", {
    name: "vouchers_vouchers_put",
    description: `Enables editing gift voucher, e.g. changing its balance, validity date or number (only for unused vouchers)
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "vouchers": { "type": "array", "description": "List of vouchers to edit", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Voucher ID" }, "number": { "type": "string", "description": "Number." }, "name": { "type": "string", "description": "Name." }, "expirationDate": { "type": "string", "description": "Voucher expiration date" }, "balanceOperationType": { "type": "string", "description": "Balance operation type, possible values:\n                - set - balance positioning of funds,\n                - add - add funds to balance,\n                - subtract - subtract funds from balance.", "enum": ["set", "add", "subtract"] }, "balance": { "type": "object", "description": "Voucher balance", "properties": { "amount": { "type": "number", "description": "Available balance", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } }, "shops": { "type": "array", "description": "List of shops the voucher is active in", "items": { "type": "number" } }, "note": { "type": "string", "description": "" }, "status": { "type": "string", "description": "Status, possible values:\n                - used - used,\n                - unused - unused,", "enum": ["used", "unused"] } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/vouchers/vouchers",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["vouchers_vouchers_post", {
    name: "vouchers_vouchers_post",
    description: `Enables adding new gift vouchers with the selected voucher type
(Tags: CRM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "vouchers": { "type": "array", "description": "List of vouchers to add", "items": { "type": "object", "properties": { "typeId": { "type": "number", "description": "Gift voucher type id" }, "number": { "type": "string", "description": "Number." }, "name": { "type": "string", "description": "Name." }, "expirationDate": { "type": "string", "description": "Voucher expiration date" }, "balance": { "type": "object", "description": "Voucher balance", "properties": { "amount": { "type": "number", "description": "Available balance", "format": "float" }, "currency": { "type": "string", "description": "Currency." } } }, "shops": { "type": "array", "description": "List of shops the voucher is active in", "items": { "type": "number" } }, "note": { "type": "string", "description": "" } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/vouchers/vouchers",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["CRM"],
    deprecated: false
  }],
  ["warranties_countTotal_get", {
    name: "warranties_countTotal_get",
    description: `Method that enables getting the number of product guarantees available in the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "warranty_ids": { "type": "array", "description": "", "items": { "type": "string" } } } },
    method: "get",
    pathTemplate: "/warranties/countTotal",
    executionParameters: [{ "name": "warranty_ids", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["warranties_languageData_put", {
    name: "warranties_languageData_put",
    description: `Method that enables editing product warranty language settings.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "lang_data": { "type": "array", "description": "", "items": { "type": "object", "properties": { "warranty_id": { "type": "string", "description": "Warranty ID (numeric or text based)." }, "lang": { "type": "array", "description": "", "items": { "type": "object", "properties": { "lang_id": { "type": "string", "description": "Warranty language id (numeric) (three letter sequence)." }, "name": { "type": "string", "description": "Warranty name." }, "icon": { "type": "string", "description": "warranty icon for language." }, "icon_settings": { "type": "object", "description": "", "properties": { "format": { "type": "string", "description": "", "enum": ["jpg", "gif", "png"] }, "data_type": { "type": "string", "description": "", "enum": ["url", "base64"] } } }, "description": { "type": "string", "description": "Warranty description." } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/warranties/languageData",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["warranties_warranties_delete_post", {
    name: "warranties_warranties_delete_post",
    description: `Method that enables deleting product warranties from the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "warranty_ids": { "type": "array", "description": "", "items": { "type": "string" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/warranties/warranties/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["warranties_warranties_get", {
    name: "warranties_warranties_get",
    description: `Method that enables getting a list of product warranties available in the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "warranty_ids": { "type": "array", "description": "", "items": { "type": "string" } }, "results_limit": { "type": "number", "description": "Number of results on page." }, "results_page": { "type": "number", "description": "Result page number." }, "results_order": { "type": "object", "description": "", "properties": { "field": { "type": "string", "description": "", "enum": ["warranty_id", "warranty_name"] }, "order": { "type": "string", "description": "Sorting order.", "enum": ["ascending", "descending"] } } } } },
    method: "get",
    pathTemplate: "/warranties/warranties",
    executionParameters: [{ "name": "warranty_ids", "in": "query" }, { "name": "results_limit", "in": "query" }, { "name": "results_page", "in": "query" }, { "name": "results_order", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["warranties_warranties_put", {
    name: "warranties_warranties_put",
    description: `Method that enables editing product warranties available in the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "warranties": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "string", "description": "Warranty ID (numeric or text based)." }, "name": { "type": "string", "description": "Name." }, "type": { "type": "string", "description": "", "enum": ["seller", "producer"] }, "period": { "type": "number", "description": "Warranty time. Default value 12." } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/warranties/warranties",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["warranties_warranties_post", {
    name: "warranties_warranties_post",
    description: `Method that enables adding product warranties to the administration panel.
(Tags: PIM)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "warranties": { "type": "array", "description": "", "items": { "type": "object", "properties": { "name": { "type": "string", "description": "Name." }, "type": { "type": "string", "description": "", "enum": ["seller", "producer"] }, "period": { "type": "number", "description": "Warranty time. Default value 12." }, "shopname": { "type": "object", "description": "Name of warranty.", "properties": { "languages": { "type": "array", "description": "", "items": { "type": "object", "properties": { "language_id": { "type": "string", "description": "Language ID." }, "language_name": { "type": "string", "description": "Language name." }, "value": { "type": "string", "description": "Literal in selected language." } } } } } }, "description": { "type": "object", "description": "Warranty description.", "properties": { "languages": { "type": "array", "description": "", "items": { "type": "object", "properties": { "language_id": { "type": "string", "description": "Language ID." }, "language_name": { "type": "string", "description": "Language name." }, "value": { "type": "string", "description": "Literal in selected language." } } } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/warranties/warranties",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["PIM"],
    deprecated: false
  }],
  ["wms_locations_get", {
    name: "wms_locations_get",
    description: `The method allows to download information about a selected location or all locations in a given warehouse together with a list of product IDs located in these locations.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "locationId": { "type": "number", "description": "Warehouse location ID" }, "locationCode": { "type": "string", "description": "Storage location code" }, "stockId": { "type": "number", "description": "Stock ID" }, "returnElements": { "type": "array", "description": "Elements to be returned by the endpoint. By default all elements are returned. Available values: locationName, locationPath, locationCode, stockId, products", "items": { "type": "string" } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/wms/locations",
    executionParameters: [{ "name": "locationId", "in": "query" }, { "name": "locationCode", "in": "query" }, { "name": "stockId", "in": "query" }, { "name": "returnElements", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_acceptMM_put", {
    name: "wms_stocksdocuments_acceptMM_put",
    description: `The method enables the MM document to be received at the target warehouse.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "id": { "type": "number", "description": "Document identifier." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/wms/stocksdocuments/acceptMM",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_close_put", {
    name: "wms_stocksdocuments_close_put",
    description: `Method that enables closing warehouse documents.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "id": { "type": "number", "description": "Document identifier." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/wms/stocksdocuments/close",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_documents_delete_post", {
    name: "wms_stocksdocuments_documents_delete_post",
    description: `Method that enables deleting open warehouse documents.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "id": { "type": "number", "description": "Document identifier." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/wms/stocksdocuments/documents/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_documents_get", {
    name: "wms_stocksdocuments_documents_get",
    description: `The method allows for downloading a list of warehouse documents.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "stockDocumentType": { "type": "string", "description": "Document type.", "enum": ["pz", "pw", "px", "rx", "rw", "wz", "mm", "zw"] }, "stockDocumentStatus": { "type": "string", "description": "Document status.", "enum": ["open", "on_the_way", "close"] }, "stockDocumentsIds": { "type": "array", "description": "Document identifier.", "items": { "type": "number" } }, "stockDocumentsNumbers": { "type": "array", "description": "Document number.", "items": { "type": "string" } }, "productsInPreorder": { "type": "string", "description": "Products available in presales.", "enum": ["y", "n"] }, "dateRange": { "type": "object", "description": "Date range", "properties": { "dateType": { "type": "string", "description": "The type of date by which documents are searched", "enum": ["open", "modify", "close", "stockOperation"] }, "dateBegin": { "type": "string", "description": "Beginning date in YYYY-MM-DD HH:MM:SS format" }, "dateEnd": { "type": "string", "description": "Ending date in YYYY-MM-DD HH:MM:SS format" } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/wms/stocksdocuments/documents",
    executionParameters: [{ "name": "stockDocumentType", "in": "query" }, { "name": "stockDocumentStatus", "in": "query" }, { "name": "stockDocumentsIds", "in": "query" }, { "name": "stockDocumentsNumbers", "in": "query" }, { "name": "productsInPreorder", "in": "query" }, { "name": "dateRange", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_documents_put", {
    name: "wms_stocksdocuments_documents_put",
    description: `The method allows for warehouse documents edit .
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "stockDocumentId": { "type": "number", "description": "Document identifier." }, "stockDocumentType": { "type": "string", "description": "Document type. \n                Available values: \n                \"pz\" - goods received note (GRN), \n                \"pw\" - internal delivery note (IDN),  \n                \"px\" - goods received correction note (GRX), \n                \"rx\" - goods despatch note (GRN) , \n                \"rw\" - goods issued note (GIN), \n                \"mm\" - inter-warehouse transfer.", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "stockDocumentNumber": { "type": "string", "description": "Number of purchase document" }, "stockId": { "type": "number", "description": "Target warehouse ID. \n                  The list of available warehouses can be downloaded via the method <a href = \"en/shop/api/?action=method&function=systemconfig&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=systemconfig\">SystemConfig</a>." }, "stockSourceId": { "type": "number", "description": "Source warehouse ID. \n                  The list of available warehouses can be downloaded via the method <a href = \"en/shop/api/?action=method&function=systemconfig&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=systemconfig\">SystemConfig</a>." }, "note": { "type": "string", "description": "" }, "productsInPreorder": { "type": "string", "description": "Products available in presales.\n                Available values: \n                \"y\" - yes,\n                \"n\" - no.", "enum": ["y", "n"] }, "delivererId": { "type": "number", "description": "Supplier ID." }, "wnt": { "type": "string", "description": "Type of purchase document. \n                Available values: \n                \"national_VAT_invoice\" - National VAT invoice,\n                \"other_purchase_document\" - Other purchase document,\n                \"invoice_without_VAT\" - Invoice without VAT (EU),\n                \"imports_from_outside_the_EU\" - Import from outside EU.", "enum": ["national_VAT_invoice", "other_purchase_document", "invoice_without_VAT", "imports_from_outside_the_EU"] }, "saleDocumentCreationDate": { "type": "string", "description": "Issue date of purchase document. Correct format is yyyy-mm-dd, e.g. 2007-12-31.." }, "deliveryOnTheWayPlannedDeliveryDate": { "type": "string", "description": "Planned date of acceptance of delivery. Correct format is yyyy-mm-dd, e.g. 2007-12-31. Requires parameter: \"confirmed=on_the_way\"." }, "confirmed": { "type": "string", "description": "Document status.\n              Available values: \n              \"open\" - open,\n              \"on_the_way\" - on the way.", "enum": ["open", "on_the_way"] }, "currencyForPurchasePrice": { "type": "string", "description": "Purchase price currency, e.g. PLN, USD, GBP" }, "currencyForPurchasePriceRate": { "type": "number", "description": "Currency exchange rate (Currency conversion)", "format": "float" }, "currencyForPurchasePriceRateType": { "type": "string", "description": "Type of currency rate.\n                Available values: \n                \"custom\" - not typical,\n                \"currentDay\" - the currency rate from the day of issuing a stock document,\n                \"customDay\" - on a selected day,\n                \"previousDay\" - the currency rate of a working day preceding the date of the stock document issue.", "enum": ["custom", "currentDay", "customDay", "previousDay"] }, "currencyForPurchasePriceRateDate": { "type": "string", "description": "Currency rate of the day. Correct format is yyyy-mm-dd, e.g. 2007-12-31.." }, "priceType": { "type": "string", "description": "Settlement by prices.\n              Available values: \n              \"brutto\" - Gross value,\n              \"netto\" - Net value.", "enum": ["brutto", "netto"] }, "queueType": { "type": "string", "description": "Methods of stock level correction. \n              Available values: \n              \"fifo\" - first-in, first-out (FIFO),\n              \"lifo\" - last-in, first-out (LIFO).", "enum": ["fifo", "lifo"] }, "verificationDate": { "type": "string", "description": "Verification date" }, "verificationUser": { "type": "string", "description": "Users verification" } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/wms/stocksdocuments/documents",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_documents_post", {
    name: "wms_stocksdocuments_documents_post",
    description: `Method that enables warehouse document creation.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "stockId": { "type": "number", "description": "Target warehouse ID.   The list of available warehouses can be downloaded via the method <a href = \"en/shop/api/?action=method&function=systemconfig&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=systemconfig\">SystemConfig</a>." }, "stockDocumentNumber": { "type": "string", "description": "Document number." }, "stockSourceId": { "type": "number", "description": "Source warehouse ID.   The list of available warehouses can be downloaded via the method <a href = \"en/shop/api/?action=method&function=systemconfig&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=systemconfig\">SystemConfig</a>." }, "note": { "type": "string", "description": "" }, "productsInPreorder": { "type": "string", "description": "Products available in presales.\n\tAvailable values: \n\t\"y\" - yes,\n\t\"n\" - no.", "enum": ["y", "n"] }, "delivererId": { "type": "number", "description": "Supplier ID." }, "wnt": { "type": "string", "description": "Type of purchase document. \n\tAvailable values: \n\t\"national_VAT_invoice\" - National VAT invoice,\n\t\"other_purchase_document\" - Other purchase document,\n\t\"invoice_without_VAT\" - Invoice without VAT (EU),\n\t\"imports_from_outside_the_EU\" - Import from outside EU.", "enum": ["national_VAT_invoice", "other_purchase_document", "invoice_without_VAT", "imports_from_outside_the_EU"] }, "saleDocumentCreationDate": { "type": "string", "description": "Issue date of purchase document. Correct format is yyyy-mm-dd, e.g. 2007-12-31.." }, "deliveryOnTheWayPlannedDeliveryDate": { "type": "string", "description": "Planned date of acceptance of delivery. Correct format is yyyy-mm-dd, e.g. 2007-12-31. Requires parameter: \"confirmed=on_the_way\"." }, "confirmed": { "type": "string", "description": "Document status.\n\tAvailable values: \n\t\"open\" - open,\n\t\"on_the_way\" - on the way.", "enum": ["open", "on_the_way"] }, "currencyForPurchasePrice": { "type": "string", "description": "Purchase price currency, e.g. PLN, USD, GBP" }, "priceType": { "type": "string", "description": "Settlement by prices.\n\tAvailable values: \n\t\"brutto\" - Gross value,\n\t\"netto\" - Net value", "enum": ["brutto", "netto"] }, "queueType": { "type": "string", "description": "Methods of stock level correction. \n\tAvailable values: \n\t\"fifo\" - first-in, first-out (FIFO),\n\t\"lifo\" - last-in, first-out (LIFO)", "enum": ["fifo", "lifo"] } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/wms/stocksdocuments/documents",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_openedDocuments_get", {
    name: "wms_stocksdocuments_openedDocuments_get",
    description: `Method that enables getting a list of open warehouse documents.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "status": { "type": "string", "description": "", "enum": ["open", "on_the_way", "all"] }, "stockId": { "type": "number", "description": "Target warehouse ID. \n                  The list of available warehouses can be downloaded via the method <a href = \"en/shop/api/?action=method&function=systemconfig&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=systemconfig\">SystemConfig</a>." }, "stockSourceId": { "type": "number", "description": "Source warehouse ID. \n                  The list of available warehouses can be downloaded via the method <a href = \"en/shop/api/?action=method&function=systemconfig&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=systemconfig\">SystemConfig</a>." }, "dateRange": { "type": "object", "description": "Date range", "properties": { "dateType": { "type": "string", "description": "The type of date by which documents are searched. \n                Available values: \n                \"open\" - Document creation date,\n                \"modify\" - Document modification date.", "enum": ["open", "modify"] }, "dateBegin": { "type": "string", "description": "Beginning date in YYYY-MM-DD HH:MM:SS format" }, "dateEnd": { "type": "string", "description": "Ending date in YYYY-MM-DD HH:MM:SS format" } } }, "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" } } },
    method: "get",
    pathTemplate: "/wms/stocksdocuments/openedDocuments",
    executionParameters: [{ "name": "type", "in": "query" }, { "name": "status", "in": "query" }, { "name": "stockId", "in": "query" }, { "name": "stockSourceId", "in": "query" }, { "name": "dateRange", "in": "query" }, { "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_products_delete_post", {
    name: "wms_stocksdocuments_products_delete_post",
    description: `Method that enables deleting products from warehouse documents.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "product": { "type": "number", "description": "Stock keeping unit." }, "size": { "type": "string", "description": "Product size ID." } } } }, "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "id": { "type": "number", "description": "Document identifier." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/wms/stocksdocuments/products/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_products_get", {
    name: "wms_stocksdocuments_products_get",
    description: `Method that enables getting a list of products present on a warehouse document.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm", "wz", "zw"] }, "id": { "type": "number", "description": "Document identifier." }, "results_page": { "type": "number", "description": "Result page number." }, "results_limit": { "type": "number", "description": "Number of results on page." } } },
    method: "get",
    pathTemplate: "/wms/stocksdocuments/products",
    executionParameters: [{ "name": "type", "in": "query" }, { "name": "id", "in": "query" }, { "name": "results_page", "in": "query" }, { "name": "results_limit", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_products_put", {
    name: "wms_stocksdocuments_products_put",
    description: `Method that enables, amongst others, editing the quantity of a given product on a warehouse document.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "product": { "type": "number", "description": "Stock keeping unit." }, "size": { "type": "string", "description": "Product size ID." }, "quantity": { "type": "number", "description": "Product quantity." }, "productPurchasePrice": { "type": "number", "description": "Cost price", "format": "float" }, "locationId": { "type": "number", "description": "Warehouse location ID.  The list of available warehouse locations can be downloaded via the method <a href = \"pl/shop/api/?action=method&function=locations&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=locations\">Locations</a> ." }, "locationCode": { "type": "string", "description": "Storage location code" }, "locationTextId": { "type": "string", "description": "Warehouse location full path. Use a backslash (\\) as a separator, for example:  M1\\Section name\\Location name.  The list of available warehouse locations can be downloaded via the method <a href = \"pl/shop/api/?action=method&function=locations&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=locations\">Locations</a> ." } } } }, "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "id": { "type": "number", "description": "Document identifier." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/wms/stocksdocuments/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_products_post", {
    name: "wms_stocksdocuments_products_post",
    description: `Method that enables adding products to warehouse documents.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "products": { "type": "array", "description": "Products list.", "items": { "type": "object", "properties": { "product": { "type": "number", "description": "Stock keeping unit." }, "size": { "type": "string", "description": "Product size ID." }, "quantity": { "type": "number", "description": "Product quantity." }, "productPurchasePrice": { "type": "number", "description": "Cost price", "format": "float" }, "locationId": { "type": "number", "description": "Warehouse location ID.  The list of available warehouse locations can be downloaded via the method <a href = \"pl/shop/api/?action=method&function=locations&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=locations\">Locations</a> ." }, "locationCode": { "type": "string", "description": "Storage location code" }, "locationTextId": { "type": "string", "description": "Warehouse location full path. Use a backslash (\\) as a separator, for example:  M1\\Section name\\Location name.  The list of available warehouse locations can be downloaded via the method <a href = \"pl/shop/api/?action=method&function=locations&method=get\">#get</a> in gateway <a href = \"en/shop/api/?action=documentation&function=locations\">Locations</a> ." } } } }, "type": { "type": "string", "description": "", "enum": ["pz", "pw", "px", "rx", "rw", "mm"] }, "id": { "type": "number", "description": "Document identifier." } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/wms/stocksdocuments/products",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_stocksdocuments_rejectMM_put", {
    name: "wms_stocksdocuments_rejectMM_put",
    description: `The method allows to withdraw the MM document to the source warehouse.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "id": { "type": "number", "description": "Document identifier." } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/wms/stocksdocuments/rejectMM",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_suppliers_suppliers_delete_post", {
    name: "wms_suppliers_suppliers_delete_post",
    description: `The method allows for the removal of suppliers..
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "ids": { "type": "array", "description": "Id", "items": { "type": "number" } } } } }, "description": "The JSON request body." } } },
    method: "post",
    pathTemplate: "/wms/suppliers/suppliers/delete",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_suppliers_suppliers_get", {
    name: "wms_suppliers_suppliers_get",
    description: `The method allows to download a list of suppliers along with information about the number of products assigned to them.
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "resultsPage": { "type": "number", "description": "Page with results number. Numeration starts from 0" }, "resultsLimit": { "type": "number", "description": "Number of results on page. Value from 1 to 100" }, "returnProductsCount": { "type": "boolean", "description": "Return quantity of products assigned to supplier" }, "names": { "type": "array", "description": "Names", "items": { "type": "string" } }, "ids": { "type": "array", "description": "IDs", "items": { "type": "number" } } } },
    method: "get",
    pathTemplate: "/wms/suppliers/suppliers",
    executionParameters: [{ "name": "resultsPage", "in": "query" }, { "name": "resultsLimit", "in": "query" }, { "name": "returnProductsCount", "in": "query" }, { "name": "names", "in": "query" }, { "name": "ids", "in": "query" }],
    requestBodyContentType: undefined,
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
  ["wms_suppliers_suppliers_put", {
    name: "wms_suppliers_suppliers_put",
    description: `The method allows information about suppliers to be updated, including address details, description, order preparation time or supplier working hours..
(Tags: WMS)`,
    inputSchema: { "type": "object", "properties": { "requestBody": { "type": "object", "properties": { "params": { "type": "object", "description": "Parameters transmitted to method", "properties": { "suppliers": { "type": "array", "description": "", "items": { "type": "object", "properties": { "id": { "type": "number", "description": "Id" }, "name": { "type": "string", "description": "Name." }, "email": { "type": "string", "description": "e-mail address. (limit of 50 characters)" }, "phone": { "type": "string", "description": "Phone number. (limit of 20 characters)" }, "fax": { "type": "string", "description": "Fax. (limit of 20 characters)" }, "street": { "type": "string", "description": "Address. (limit of 50 characters)" }, "zipCode": { "type": "string", "description": "ZIP / Post code. (limit of 6 characters)" }, "city": { "type": "string", "description": "Town / City. (limit of 50 characters)" }, "country": { "type": "number", "description": "Region ID" }, "taxCode": { "type": "string", "description": "VAT no.. (limit of 13 characters)" }, "averageDeliveryTime": { "type": "object", "description": "Average delivery time", "properties": { "value": { "type": "number", "description": "value" }, "unit": { "type": "string", "description": "Unit", "enum": ["minutes", "hours", "days", "immediately"] } } }, "description": { "type": "string", "description": "Description. (limit of 255 characters)" }, "orderCompletionTime": { "type": "object", "description": "Order preparation time for shipment", "properties": { "value": { "type": "number", "description": "value" }, "unit": { "type": "string", "description": "Unit", "enum": ["minutes", "hours", "days", "immediately"] } } }, "workDays": { "type": "array", "description": "Supplier working hours", "items": { "type": "object", "properties": { "day": { "type": "number", "description": "day" }, "type": { "type": "string", "description": "", "enum": ["deliverer_closed", "deliverer_open_hours", "deliverer_open_24h"] }, "from": { "type": "string", "description": "from" }, "to": { "type": "string", "description": "to" } } } } } } } } } }, "description": "The JSON request body." } } },
    method: "put",
    pathTemplate: "/wms/suppliers/suppliers",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{ "ApiKeyAuth": [] }, { "bearerAuth": [] }],
    tags: ["WMS"],
    deprecated: false
  }],
]);

export const securitySchemes = {
    "ApiKeyAuth": {
      "type": "apiKey",
      "in": "header",
      "name": "X-API-KEY",
      "description": "Provide the API Key"
    },
    "bearerAuth": {
      "type": "http",
      "scheme": "bearer",
      "bearerFormat": "JWT",
      "description": "Provide the OAuth Token"
    }
};

/**
 * Sanitizes JSON Schemas to satisfy Google Gemini / OpenCode function calling rules
 */
export function sanitizeSchemaNode(node: any): any {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return node;

  // 1. Flatten polymorphism (anyOf / oneOf / allOf)
  if (Array.isArray(node.anyOf) && node.anyOf.length > 0) {
    const firstOption = sanitizeSchemaNode(node.anyOf[0]);
    delete node.anyOf;
    Object.assign(node, { ...firstOption, ...node });
  }
  if (Array.isArray(node.oneOf) && node.oneOf.length > 0) {
    const firstOption = sanitizeSchemaNode(node.oneOf[0]);
    delete node.oneOf;
    Object.assign(node, { ...firstOption, ...node });
  }
  if (Array.isArray(node.allOf) && node.allOf.length > 0) {
    const merged = node.allOf.reduce((acc: any, item: any) => ({ ...acc, ...sanitizeSchemaNode(item) }), {});
    delete node.allOf;
    Object.assign(node, { ...merged, ...node });
  }

  // 2. Fix Object types & recursively sanitize properties
  if (node.properties && typeof node.properties === 'object') {
    node.type = 'object';
    for (const key of Object.keys(node.properties)) {
      node.properties[key] = sanitizeSchemaNode(node.properties[key]);
    }
  }

  // 3. Fix Required arrays (Gemini strict rule)
  if (Array.isArray(node.required)) {
    if (node.type !== 'object' || !node.properties) {
      delete node.required;
    } else {
      const validProps = Object.keys(node.properties);
      node.required = node.required.filter((reqKey: any) => 
        typeof reqKey === 'string' && validProps.includes(reqKey)
      );
      if (node.required.length === 0) {
        delete node.required;
      }
    }
  }

  // 4. Fix Array types & missing items schema
  if (node.type === 'array' || node.items) {
    node.type = 'array';
    if (!node.items) {
      node.items = { type: 'string' };
    } else {
      node.items = sanitizeSchemaNode(node.items);
    }
  }

  delete node.$schema;
  delete node.$id;

  return node;
}

export function enrichInputSchema(inputSchema: any) {
  let schema = JSON.parse(JSON.stringify(inputSchema || { type: 'object', properties: {} }));
  schema = sanitizeSchemaNode(schema);

  schema.type = 'object';
  if (!schema.properties) {
    schema.properties = {};
  }

  schema.properties.override_domain = {
    type: 'string',
    description: 'Optional: Override target domain for this request (e.g. "demo219-pl.yourtechnicaldomain.com")'
  };
  schema.properties.override_api_key = {
    type: 'string',
    description: 'Optional: Override API Key (X-API-KEY) for this request'
  };

  return sanitizeSchemaNode(schema);
}

/**
 * Executes an API tool with credential resolution priority:
 * 1. Prompt Overrides (override_domain / override_api_key)
 * 2. Context Credentials (HTTP Headers from remote server)
 * 3. Local Environment Variables (IDOSELL_DOMAIN / IDOSELL_API_KEY)
 */
export async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>,
    contextCredentials?: { domain?: string; apiKey?: string }
): Promise<CallToolResult> {
  try {
    let validatedArgs: JsonObject;
    try {
        const enrichedSchema = enrichInputSchema(definition.inputSchema);
        const zodSchema = getZodSchemaFromJsonSchema(enrichedSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}):${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    const overrideDomain = toolArgs?.override_domain || validatedArgs?.override_domain;
    const overrideApiKey = toolArgs?.override_api_key || validatedArgs?.override_api_key;

    // Resolve Domain
    const domainToUse = overrideDomain || contextCredentials?.domain || process.env.IDOSELL_DOMAIN || process.env.API_DOMAIN || process.env.DOMAIN;
    
    // Resolve API Key
    const apiKeyToUse = overrideApiKey || contextCredentials?.apiKey || process.env.IDOSELL_API_KEY || process.env.API_KEY || process.env.APIKEY;

    if (!domainToUse) {
        return { content: [{ type: "text", text: "Error: No target domain provided via prompt, HTTP headers, or environment variables." }] };
    }

    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            } else if (param.in === 'query') {
                queryParams[param.name] = value;
            } else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }

    const requestUrl = `https://${domainToUse.replace(/^https?:\/\//, '').replace(/\/$/, '')}/api/admin/v8${urlPath}`;

    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }

    if (apiKeyToUse) {
        headers['x-api-key'] = String(apiKeyToUse);
    }

    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(),
      url: requestUrl,
      params: queryParams,
      headers: headers,
      paramsSerializer: (params: Record<string, any>) => {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value === undefined || value === null) continue;
          search.append(key, Array.isArray(value) ? value.join(',') : String(value));
        }
        return search.toString();
      },
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);

    const response = await axios(config);
    let responseText = '';
    const contentType = String(response.headers['content-type'] ?? '').toLowerCase();
    
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch { 
             responseText = "[Stringify Error]"; 
         }
    } else if (typeof response.data === 'string') { 
         responseText = response.data; 
    } else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    } else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    return { content: [{ type: "text", text: `API Response (Status: ${response.status}):\n${responseText}` }] };

  } catch (error: unknown) {
    let errorMessage: string = axios.isAxiosError(error) 
        ? formatApiError(error) 
        : (error instanceof Error ? error.message : String(error));
    
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    return { content: [{ type: "text", text: errorMessage }] };
  }
}

export function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        } else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        } else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

export function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        const zodSchema = eval(zodSchemaString);
        if (typeof zodSchema?.parse !== 'function') { 
            throw new Error('Eval did not produce a valid Zod schema.'); 
        }
        return zodSchema as z.ZodTypeAny;
    } catch (err: any) {
        console.error(`Failed to generate/evaluate Zod schema for '${toolName}':`, err);
        return z.object({}).passthrough();
    }
}