// CSV Export Utility — generates and downloads CSV files from data arrays
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers.map(h => {
                let val = row[h];
                if (val === null || val === undefined) val = '';
                if (typeof val === 'object') val = JSON.stringify(val);
                // Escape commas and quotes
                val = String(val).replace(/"/g, '""');
                return `"${val}"`;
            }).join(',')
        )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

// Format data for specific exports
export const formatReportsForExport = (reports) => {
    return reports.map(r => ({
        'Student Name': r.student?.name || '',
        'Student ID': r.student?.userId || '',
        'Task': r.task?.title || '',
        'Internship': r.task?.internship?.title || '',
        'Content': r.content || '',
        'Grade': r.grade || 'Pending',
        'Graded By': r.gradedBy?.name || '',
        'Has PDF': r.fileName ? 'Yes' : 'No',
        'Submitted At': r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '',
    }));
};

export const formatUsersForExport = (users) => {
    return users.map(u => ({
        'User ID': u.userId || '',
        'Name': u.name || '',
        'Email': u.email || '',
        'Role': u.role || '',
        'Created At': u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
    }));
};

export const formatCertificatesForExport = (certs) => {
    return certs.map(c => ({
        'Certificate ID': c.certificateId || '',
        'Student': c.student?.name || '',
        'Internship': c.internship?.title || '',
        'Company': c.internship?.company || '',
        'Grade': c.grade || '',
        'Issued By': c.issuedBy?.name || '',
        'Issued At': c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : '',
    }));
};

export const formatAnalyticsForExport = (data) => {
    return [
        { 'Metric': 'Total Internships', 'Value': data.totalInternships },
        { 'Metric': 'Total Students', 'Value': data.totalStudents },
        { 'Metric': 'Total Applications', 'Value': data.totalApps },
        { 'Metric': 'Total Tasks', 'Value': data.totalTasks },
        { 'Metric': 'Total Reports', 'Value': data.totalReports },
        { 'Metric': 'Total Certificates', 'Value': data.totalCerts },
        { 'Metric': 'Average Rating', 'Value': data.avgRating },
        { 'Metric': 'Acceptance Rate', 'Value': `${data.acceptRate}%` },
    ];
};
