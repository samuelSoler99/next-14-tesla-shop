
// https://tailwindcomponents.com/component/hoverable-table
import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
import {  UsersTable } from './ui/UserTable';
import { getPaginatedUsers } from '@/actions/users/get-paginated-users';

export default async function usersPage() {

    const { ok, users = [] } = await getPaginatedUsers();

    if (!ok) {
        redirect('/auth/login');
    }



    return (
        <>
            <Title title="Gestion de Usuarios" />

            <div className="mb-10">
              <UsersTable users={users} />

              <Pagination totalPages={3}/>
            </div>
        </>
    );
}