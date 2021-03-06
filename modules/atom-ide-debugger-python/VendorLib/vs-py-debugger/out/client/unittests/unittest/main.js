"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../common/types");
const misc_1 = require("../../common/utils/misc");
const constants_1 = require("../common/constants");
const baseTestManager_1 = require("../common/managers/baseTestManager");
const types_2 = require("../common/types");
const types_3 = require("../types");
class TestManager extends baseTestManager_1.BaseTestManager {
    get enabled() {
        return this.settings.unitTest.unittestEnabled;
    }
    constructor(workspaceFolder, rootDirectory, serviceContainer) {
        super(constants_1.UNITTEST_PROVIDER, types_1.Product.unittest, workspaceFolder, rootDirectory, serviceContainer);
        this.argsService = this.serviceContainer.get(types_3.IArgumentsService, this.testProvider);
        this.helper = this.serviceContainer.get(types_2.ITestsHelper);
        this.runner = this.serviceContainer.get(types_3.ITestManagerRunner, this.testProvider);
    }
    configure() {
        misc_1.noop();
    }
    getDiscoveryOptions(ignoreCache) {
        const args = this.settings.unitTest.unittestArgs.slice(0);
        return {
            workspaceFolder: this.workspaceFolder,
            cwd: this.rootDirectory, args,
            token: this.testDiscoveryCancellationToken, ignoreCache,
            outChannel: this.outputChannel
        };
    }
    runTestImpl(tests, testsToRun, runFailedTests, debug) {
        return __awaiter(this, void 0, void 0, function* () {
            let args;
            const runAllTests = this.helper.shouldRunAllTests(testsToRun);
            if (debug) {
                args = this.argsService.filterArguments(this.settings.unitTest.unittestArgs, runAllTests ? types_3.TestFilter.debugAll : types_3.TestFilter.debugSpecific);
            }
            else {
                args = this.argsService.filterArguments(this.settings.unitTest.unittestArgs, runAllTests ? types_3.TestFilter.runAll : types_3.TestFilter.runSpecific);
            }
            if (runFailedTests === true) {
                testsToRun = { testFile: [], testFolder: [], testSuite: [], testFunction: [] };
                testsToRun.testFunction = tests.testFunctions.filter(fn => {
                    return fn.testFunction.status === types_2.TestStatus.Error || fn.testFunction.status === types_2.TestStatus.Fail;
                }).map(fn => fn.testFunction);
            }
            const options = {
                workspaceFolder: this.workspaceFolder,
                cwd: this.rootDirectory,
                tests, args, testsToRun, debug,
                token: this.testRunnerCancellationToken,
                outChannel: this.outputChannel
            };
            return this.runner.runTest(this.testResultsService, options, this);
        });
    }
}
exports.TestManager = TestManager;
//# sourceMappingURL=main.js.map