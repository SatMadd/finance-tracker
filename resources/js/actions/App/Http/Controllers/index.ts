import DashboardController from './DashboardController'
import TransactionController from './TransactionController'
import CategoryController from './CategoryController'
import StatisticsController from './StatisticsController'
import FinanceSettingsController from './FinanceSettingsController'
import Settings from './Settings'
const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
TransactionController: Object.assign(TransactionController, TransactionController),
CategoryController: Object.assign(CategoryController, CategoryController),
StatisticsController: Object.assign(StatisticsController, StatisticsController),
FinanceSettingsController: Object.assign(FinanceSettingsController, FinanceSettingsController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers