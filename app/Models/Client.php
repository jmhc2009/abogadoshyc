<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $rut
 * @property string|null $street
 * @property string|null $number
 * @property string|null $commune
 * @property string|null $region
 * @property string|null $occupation
 * @property string|null $marital_status
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $nationality
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable(['name', 'rut', 'street', 'number', 'commune', 'region', 'occupation', 'marital_status', 'phone', 'email', 'nationality'])]
class Client extends Model
{
    // Model implementation

    public function causasRepresentadas(): BelongsToMany
    {
        return $this->belongsToMany(Causa::class, 'causa_cliente');
    }
}
