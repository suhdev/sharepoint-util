function Init-Project {
    <#
    .SYNOPSIS
    Test
    .DESCRIPTION
    Test
    .PARAMETER name
    Name
    #>
    [CmdletBinding(SupportsShouldProcess=$True,ConfirmImpact='Low')]
    param 
    (
        [Parameter(Mandatory=$True,
        ValueFromPipeline=$True,
        ValueFromPipelineByPropertyName=$True,
        HelpMessage='What is the project name?')]
        [Alias('host')]
        [ValidateLength(3,30)]
        [string]$ProjectName
    )

    Write-Verbose "Creating project $ProjectName config file"
    

    Write-Host "Suhail $ComputerName"
    Write-Verbose "Suhail Abood"
}