<template>
    <div>
        <div class="search-panel">
            <el-form :inline="true" :model="query" class="demo-form-inline" @keyup.enter="search">
                <el-form-item label="查询 :">
                    <el-input size="small" v-model="query.searchKey" placeholder="关键字" />
                </el-form-item>
                <el-form-item label="性别 :">
                    <EnumSelect size="small" api="/enum/Get/Gender" v-model="query.gender" />
                </el-form-item>
                <el-form-item label="工作状态 :">
                    <EnumSelect size="small" api="/enum/Get/WorkStatus" v-model="query.workStatus" />
                </el-form-item>
                <el-form-item label="岗位 :">
                    <EnumSelect size="small" api="/position/QueryPositionByPage" v-model="query.positionId" keys="id"
                        values="positionName" :request="post" :params="{ rows: 0 }" />
                </el-form-item>
                <el-form-item label="部门 :">
                    <EnumSelect size="small" api="/department/QueryDepartmentByPage" v-model="query.departmentId" keys="id"
                        values="departmentName" :request="post" :params="{ rows: 0 }" />
                </el-form-item>
                <el-form-item label="职级 :">
                    <EnumSelect size="small" api="/enum/Get/PositionLevel" v-model="query.positionLevel" />
                </el-form-item>
                <el-form-item label="学历 :">
                    <EnumSelect size="small" api="/enum/Get/AcademicDegree" v-model="query.academicDegree" />
                </el-form-item>
                <el-form-item label="婚姻状态 :">
                    <EnumSelect size="small" api="/enum/Get/MaritalStatus" v-model="query.maritalStatus" />
                </el-form-item>
                <el-form-item label="状态 :">
                    <EnumSelect size="small" api="/enum/Get/DataStatus" v-model="query.status" />
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="search">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="success"
                        @click="() => { currentEmployee = {}; employeeEditVisible = true }">添加</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="success" @click="exportEmployee">导出到Excel</el-button>
                    <el-popover placement="bottom" :width="380" trigger="click" @hide="() => {
                        uploadResult = {
                            employeeSuccessCount: 0,
                            employeeErrorCount: 0,
                            userSuccessCount: 0,
                            userErrorCount: 0,
                            bindSuccessCount: 0,
                            bindErrorCount: 0
                        }; fileList = []
                    }">
                        <template #reference>
                            <el-button style="margin-right: 16px" size="small" type="primary">从Excel导入</el-button>
                        </template>
                        <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom: 10px;">
                            <div style="display: flex;align-items: center;">
                                <el-upload v-model:file-list="fileList" action="#" :show-file-list="false"
                                    :http-request="importEmployee" ref="uploader" :limit="1">
                                    <el-button :loading="uploadLoading" size="small" type="primary">导入员工信息</el-button>
                                </el-upload>
                                <el-tooltip class="box-item" effect="dark" content="创建默认登陆账号,账号密码均为工号" placement="top">
                                    <el-checkbox v-model="createUser" label="允许登陆" style="margin-left:10px"></el-checkbox>
                                </el-tooltip>
                            </div>

                            <el-button size="small" type="success" @click="downloadEmployeeTemplate">下载导入模版</el-button>
                        </div>
                        <div style="text-align: center;">
                            <el-tag class="tag" type="success">添加员工成功: {{ uploadResult.employeeSuccessCount }}</el-tag>
                            <el-tag class="tag" type="success">添加用户成功: {{ uploadResult.userSuccessCount }}</el-tag>
                            <el-tag class="tag" type="success">权限绑定成功: {{ uploadResult.bindSuccessCount }}</el-tag>
                            <el-tag class="tag" type="danger">添加员工失败: {{ uploadResult.employeeErrorCount }}</el-tag>
                            <el-tag class="tag" type="danger">添加用户失败: {{ uploadResult.userErrorCount }}</el-tag>
                            <el-tag class="tag" type="danger">权限绑定失败: {{ uploadResult.bindErrorCount }}</el-tag>
                        </div>
                    </el-popover>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-panel">
            <el-table border v-loading="tableLoading" :data="employeeList" :height="tableHeight" show-overflow-tooltip>
                <el-table-column fixed="left" prop="id" label="序号" width="65">
                    <template #default="scope">
                        {{ (query.pageNum - 1) * query.rows + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column fixed="left" prop="workNum" label="工号" width="200" />
                <el-table-column fixed="left" prop="name" label="姓名" width="100" />
                <el-table-column prop="genderStr" label="性别" width="100" />
                <el-table-column prop="workStatusStr" label="工作状态" width="100" />
                <el-table-column prop="departmentName" label="部门名称" width="100" />
                <el-table-column prop="positionName" label="岗位名称" width="100" />
                <el-table-column prop="positionLevelStr" label="职级" width="100" />
                <el-table-column prop="native" label="籍贯" width="100" />
                <el-table-column prop="academicDegreeStr" label="学历" width="100" />
                <el-table-column prop="maritalStatusStr" label="婚姻状态" width="100" />
                <el-table-column prop="hireDate" label="入职日期" width="200" />
                <el-table-column prop="birthDay" label="出生日期" width="200" />
                <el-table-column prop="phone" label="手机号" width="150" />
                <el-table-column prop="email" label="电子邮箱" width="200" />
                <el-table-column prop="idCard" label="身份证号" width="200" />
                <el-table-column prop="statusStr" label="状态" width="100" />
                <el-table-column fixed="right" label="操作" width="150">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" size="small"
                                @click="() => { currentEmployee = scope.row; employeeEditVisible = true }">修改</el-button>
                            <el-button type="danger" size="small" @click="deleteEmployee(scope.row)">删除</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <div class="foot-panel">
                <el-pagination background layout="jumper, prev, pager, next , total ,sizes" :total="recordCount"
                    v-model:currentPage="query.pageNum" v-model:page-size="query.rows" />
            </div>
        </div>
        <div class="modal">
            <el-dialog v-model="employeeEditVisible" destroy-on-close title="员工编辑" style="width: 600px; max-width: 100%">
                <EmployeeEdit :employeeId="currentEmployee.id || 0"
                    @onClose="() => { currentEmployee = {}; employeeEditVisible = false; search() }" />
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { post, del, download, upload } from '@/utils/request'
import { ElMessageBox } from 'element-plus'
import EnumSelect from '@/components/EnumSelect.vue'
import EmployeeEdit from './EmployeeEdit.vue'

const query = reactive({
    searchKey: "",
    gender: -1,
    workStatus: -1,
    positionId: -1,
    departmentId: -1,
    positionLevel: -1,
    academicDegree: -1,
    maritalStatus: -1,
    status: -1,
    pageNum: 1,
    rows: 20
})
const tableHeight = ref(0)
const tableLoading = ref(false)
const employeeList = ref([])
const recordCount = ref(0)
const employeeEditVisible = ref(false)
const currentEmployee = ref({})
const uploader = ref()
const fileList = ref([])
const createUser = ref(false)
const uploadLoading = ref(false)
const uploadResult = ref({
    employeeSuccessCount: 0,
    employeeErrorCount: 0,
    userSuccessCount: 0,
    userErrorCount: 0,
    bindSuccessCount: 0,
    bindErrorCount: 0
})

const search = async () => {
    try {
        tableLoading.value = true
        let res = await post("/employee/QueryEmployeeByPage", query)
        employeeList.value = res.data
        recordCount.value = res.recordCount
    } finally {
        tableLoading.value = false
    }
}
const deleteEmployee = async (row) => {

    if (row.id) {
        try {
            await ElMessageBox.confirm(`确认删除员工 ${row.name} ?'`)
            await del(`/employee/DeleteEmploy/${row.id}`)
            let index = employeeList.value.findIndex(i => i.id === row.id)
            employeeList.value.splice(index, 1)
        }
        catch (e) { }
    }
}
const exportEmployee = async () => {
    let res = await download('/employee/ExportEmployeeToExcel', 'post', query)
    // 将响应数据转换为Blob
    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    // 创建一个隐藏的a标签用于下载文件
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    console.log(res.headers["filename"])
    link.download = decodeURIComponent(res.headers["filename"]);
    link.style.display = 'none';
    document.body.appendChild(link);

    // 触发下载
    link.click();

    // 清理DOM
    document.body.removeChild(link);
}
const importEmployee = async (option) => {
    try {
        uploadLoading.value = true;
        let formData = new FormData();
        formData.append("file", option.file)
        let res = await upload(`/employee/ImportEmployeeForExcel?createUser=${createUser.value}`, formData)
        uploadResult.value = res.data
        search()
    } finally {
        uploadLoading.value = false;
    }
}
const downloadEmployeeTemplate = async () => {
    let res = await download('/employee/DownloadEmployeeTemplate', 'post')
    // 将响应数据转换为Blob
    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    // 创建一个隐藏的a标签用于下载文件
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    console.log(res.headers["filename"])
    link.download = decodeURIComponent(res.headers["filename"]);
    link.style.display = 'none';
    document.body.appendChild(link);

    // 触发下载
    link.click();

    // 清理DOM
    document.body.removeChild(link);
}

const setTableHeight = () => {
    let tableHeader = document.querySelector(".el-table__header-wrapper")
    let tableHeaderHeight = tableHeader.getBoundingClientRect().height
    let bottom = window.innerHeight - tableHeader.getBoundingClientRect().y - (tableHeaderHeight == 0 ? 40 : tableHeaderHeight)
    tableHeight.value = bottom - 25
}

watch([() => query.pageNum, () => query.rows], () => {
    search()
})
onMounted(() => {
    window.addEventListener("resize", setTableHeight)
    setTableHeight()
})
onUnmounted(() => {
    window.removeEventListener("resize", setTableHeight)
})

search()
</script>

<style scoped>
.tag {
    margin: 5px;
}
</style>