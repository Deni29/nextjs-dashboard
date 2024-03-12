import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CustomerField, InvoiceForm } from '@/app/lib/definitions';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);

    if (!invoice) {
        notFound();
    }

    if (invoice && isInvoiceForm(invoice)) {
        return (
            <main>
                <Breadcrumbs
                    breadcrumbs={[
                        { label: 'Invoices', href: '/dashboard/invoices' },
                        {
                            label: 'Edit Invoice',
                            href: `/dashboard/invoices/${id}/edit`,
                            active: true,
                        },
                    ]}
                />
                <Form invoice={invoice} customers={customers} />
            </main>
        );
    } else {
        notFound();
    }

    // Define a type guard function to check if a value is of type InvoiceForm
    function isInvoiceForm(value: any): value is InvoiceForm {
        // Check if the value has all the required properties of InvoiceForm
        return (
            typeof value.id === 'string' &&
            typeof value.customer_id === 'string' &&
            typeof value.amount === 'number' &&
            typeof value.status === 'string' &&
            (value.status === 'pending' || value.status === 'paid')
        );
    }
}