import { useAuth } from '../auth/AuthContext'
import { useFetch } from "../../shared/hooks/useFetch"
import { getAccounts } from '../accounts/Accounts.api';
import DashLayout from '../../layouts/DashLayout';


const DashboardPage = () => {
    const { user } = useAuth();
    const { data: accounts, loading, error } = useFetch(getAccounts)

    if (loading) return <div>Loading your accounts…</div>;
    if (error) return <div>Couldn't load your accounts: {error}</div>
    return (
        <DashLayout>Hello {user.first_name}! You have {accounts.length} accounts</DashLayout>
    )
}

export default DashboardPage